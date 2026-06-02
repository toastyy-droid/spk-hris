import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ShippingCoverage } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/create-spk.dto';

@Injectable()
export class SpkService {
  constructor(private prisma: PrismaService) {}

  private scoreValue(score: unknown) {
    const value = Number(score);
    return value > 10 ? Math.round(value) / 10 : value;
  }

  private calculateSupplierScore(supplier: {
    priceScore: unknown;
    qualityScore: unknown;
    deliveryScore: unknown;
    serviceScore: unknown;
    capacityScore: unknown;
    shippingCoverage?: ShippingCoverage | string;
  }) {
    let bonus = 0;
    if (supplier.shippingCoverage === 'SUPPLIER_COVERS') {
      bonus = 0.5;
    }
    const total =
      this.scoreValue(supplier.priceScore) * 0.3 +
      this.scoreValue(supplier.qualityScore) * 0.3 +
      this.scoreValue(supplier.deliveryScore) * 0.2 +
      this.scoreValue(supplier.serviceScore) * 0.1 +
      this.scoreValue(supplier.capacityScore) * 0.1 +
      bonus;

    return Math.round(total * 100) / 100;
  }

  private supplierPayload(data: CreateSupplierDto): Prisma.SupplierCreateInput {
    return {
      ...data,
      priceScore: this.scoreValue(data.priceScore),
      qualityScore: this.scoreValue(data.qualityScore),
      deliveryScore: this.scoreValue(data.deliveryScore),
      serviceScore: this.scoreValue(data.serviceScore),
      capacityScore: this.scoreValue(data.capacityScore),
      totalScore:
        data.priceScore !== undefined &&
        data.qualityScore !== undefined &&
        data.deliveryScore !== undefined &&
        data.serviceScore !== undefined &&
        data.capacityScore !== undefined
          ? this.calculateSupplierScore(data)
          : undefined,
    };
  }

  async promotionCandidates(departmentId?: number, threshold = 75) {
    const employees = await this.prisma.employee.findMany({
      where: {
        status: 'ACTIVE',
        ...(departmentId ? { departmentId } : {}),
      },
      include: {
        department: true,
        position: true,
        skills: { include: { skill: true } },
        performances: { orderBy: { period: 'desc' }, take: 1 },
      },
    });

    const results: Array<{ employeeId: number; name: string; nik: string; department: string; position: string; kpiScore: number; masaKerja: number; skillMatch: number; totalScore: number; recommended: boolean; rank?: number }> = employees.map((emp) => {
      const latestPerf = emp.performances[0];
      const kpiScore = latestPerf ? Number(latestPerf.totalScore) : 0;
      const masaKerja = Math.floor((Date.now() - emp.joinDate.getTime()) / (365.25 * 86400000));
      const skillMatch = emp.skills.length > 0
        ? Math.min(emp.skills.reduce((s, sk) => s + sk.proficiency, 0) / (emp.skills.length * 5), 1) * 100
        : 50;

      const score =
        kpiScore * 0.4 +
        Math.min(masaKerja / 20, 1) * 100 * 0.2 +
        skillMatch * 0.2 +
        80 * 0.1 +
        80 * 0.1;

      return {
        employeeId: emp.id,
        name: emp.name,
        nik: emp.nik,
        department: emp.department.name,
        position: emp.position.name,
        kpiScore,
        masaKerja,
        skillMatch: Math.round(skillMatch),
        totalScore: Math.round(score * 100) / 100,
        recommended: score >= threshold,
      };
    });

    results.sort((a, b) => b.totalScore - a.totalScore);
    results.forEach((r, i) => { r.rank = i + 1; });

    const existing = await this.prisma.spkResult.findMany({
      where: { type: 'PROMOTION' },
    });
    const existingMap = new Map(existing.map((e) => [e.employeeId, e]));

    for (const r of results) {
      const prev = existingMap.get(r.employeeId);
      if (prev) {
        const prevDetails = prev.details as Record<string, unknown> | null;
        await this.prisma.spkResult.update({
          where: { id: prev.id },
          data: {
            score: r.totalScore,
            rank: r.rank,
            details: { ...r, status: prevDetails?.status ?? 'PENDING' } as any,
          },
        });
      } else {
        const created = await this.prisma.spkResult.create({
          data: {
            type: 'PROMOTION',
            employeeId: r.employeeId,
            score: r.totalScore,
            rank: r.rank,
            details: { ...r, status: 'PENDING' } as any,
          },
        });
        existingMap.set(r.employeeId, created);
      }
    }

    const candidatesWithId = results.map((r) => {
      const saved = existingMap.get(r.employeeId);
      const status = saved ? ((saved.details as Record<string, unknown>)?.status as string) ?? 'PENDING' : 'PENDING';
      return { ...r, resultId: saved?.id, status };
    });

    return { threshold, candidates: candidatesWithId };
  }

  async updateResult(id: number, data: { status?: string; notes?: string }) {
    const existing = await this.prisma.spkResult.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Result not found');
    const details = (existing.details as Record<string, unknown>) || {};
    return this.prisma.spkResult.update({
      where: { id },
      data: { details: { ...details, ...data } },
    });
  }

  async getSuppliers(category?: string, brand?: string) {
    const suppliers = await this.prisma.supplier.findMany({
      where: {
        ...(category ? { category: { contains: category, mode: 'insensitive' as const } } : {}),
        ...(brand ? { productBrand: { contains: brand, mode: 'insensitive' as const } } : {}),
      },
      orderBy: [{ totalScore: 'desc' }, { name: 'asc' }],
    });

    return suppliers.map((supplier) => ({
      ...supplier,
      priceScore: this.scoreValue(supplier.priceScore),
      qualityScore: this.scoreValue(supplier.qualityScore),
      deliveryScore: this.scoreValue(supplier.deliveryScore),
      serviceScore: this.scoreValue(supplier.serviceScore),
      capacityScore: this.scoreValue(supplier.capacityScore),
      totalScore: supplier.totalScore === null ? null : this.scoreValue(supplier.totalScore),
    }));
  }

  async createSupplier(data: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: this.supplierPayload(data),
    });
  }

  async updateSupplier(id: number, data: UpdateSupplierDto) {
    const existing = await this.prisma.supplier.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Supplier not found');

    const merged = {
      priceScore: data.priceScore ?? Number(existing.priceScore),
      qualityScore: data.qualityScore ?? Number(existing.qualityScore),
      deliveryScore: data.deliveryScore ?? Number(existing.deliveryScore),
      serviceScore: data.serviceScore ?? Number(existing.serviceScore),
      capacityScore: data.capacityScore ?? Number(existing.capacityScore),
      shippingCoverage: data.shippingCoverage ?? existing.shippingCoverage,
    };

    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...data,
        ...(data.priceScore !== undefined ? { priceScore: this.scoreValue(data.priceScore) } : {}),
        ...(data.qualityScore !== undefined ? { qualityScore: this.scoreValue(data.qualityScore) } : {}),
        ...(data.deliveryScore !== undefined ? { deliveryScore: this.scoreValue(data.deliveryScore) } : {}),
        ...(data.serviceScore !== undefined ? { serviceScore: this.scoreValue(data.serviceScore) } : {}),
        ...(data.capacityScore !== undefined ? { capacityScore: this.scoreValue(data.capacityScore) } : {}),
        totalScore: this.calculateSupplierScore(merged),
      },
    });
  }

  async deleteSupplier(id: number) {
    const existing = await this.prisma.supplier.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Supplier not found');
    await this.prisma.supplier.delete({ where: { id } });
    return { id };
  }

  async supplierSelection(category?: string, threshold = 7.5, productBrand?: string) {
    const suppliers = await this.prisma.supplier.findMany({
      where: {
        status: 'ACTIVE',
        ...(category ? { category: { contains: category, mode: 'insensitive' as const } } : {}),
        ...(productBrand ? { productBrand: { contains: productBrand, mode: 'insensitive' as const } } : {}),
      },
    });

    const results = suppliers
      .map((supplier) => {
        const totalScore = this.calculateSupplierScore(supplier);
        return {
          supplierId: supplier.id,
          name: supplier.name,
          category: supplier.category,
          productBrand: supplier.productBrand,
          contactPerson: supplier.contactPerson,
          phone: supplier.phone,
          priceScore: this.scoreValue(supplier.priceScore),
          qualityScore: this.scoreValue(supplier.qualityScore),
          deliveryScore: this.scoreValue(supplier.deliveryScore),
          serviceScore: this.scoreValue(supplier.serviceScore),
          capacityScore: this.scoreValue(supplier.capacityScore),
          shippingCoverage: supplier.shippingCoverage,
          shippingBonus: supplier.shippingCoverage === 'SUPPLIER_COVERS' ? 0.5 : 0,
          totalScore,
          recommended: totalScore >= threshold,
          rank: 0,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((supplier, index) => ({ ...supplier, rank: index + 1 }));

    const existing = await this.prisma.spkResult.findMany({
      where: { type: 'SUPPLIER_SELECTION' },
    });
    const existingMap = new Map(existing.map((item) => [item.referenceId, item]));

    for (const result of results) {
      const prev = existingMap.get(result.supplierId);
      if (prev) {
        const prevDetails = prev.details as Record<string, unknown> | null;
        await this.prisma.spkResult.update({
          where: { id: prev.id },
          data: {
            score: result.totalScore,
            rank: result.rank,
            details: { ...result, status: prevDetails?.status ?? 'PENDING' } as any,
          },
        });
      } else {
        const created = await this.prisma.spkResult.create({
          data: {
            type: 'SUPPLIER_SELECTION',
            referenceId: result.supplierId,
            score: result.totalScore,
            rank: result.rank,
            details: { ...result, status: 'PENDING' } as any,
          },
        });
        existingMap.set(result.supplierId, created);
      }

      await this.prisma.supplier.update({
        where: { id: result.supplierId },
        data: { totalScore: result.totalScore },
      });
    }

    const suppliersWithResultId = results.map((result) => {
      const saved = existingMap.get(result.supplierId);
      const status = saved ? ((saved.details as Record<string, unknown>)?.status as string) ?? 'PENDING' : 'PENDING';
      return { ...result, resultId: saved?.id, status };
    });

    return { threshold, weights: { price: 30, quality: 30, delivery: 20, service: 10, capacity: 10, shippingBonus: 0.5 }, suppliers: suppliersWithResultId };
  }

  async earlyWarnings() {
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const sixtyDays = new Date(now);
    sixtyDays.setDate(sixtyDays.getDate() + 60);
    const twoYearsAgo = new Date(now);
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const [decliningPerformance, contractExpiring, noRaiseLongTerm, highAbsence] = await Promise.all([
      this.prisma.performance.findMany({
        where: { period: { gte: threeMonthsAgo.toISOString().slice(0, 7) }, totalScore: { lt: 50 } },
        include: { employee: { select: { id: true, name: true, nik: true } } },
      }),
      this.prisma.employee.findMany({
        where: { status: 'ACTIVE', contractEnd: { lte: sixtyDays, gte: now } },
        select: { id: true, name: true, nik: true, contractEnd: true },
      }),
      this.prisma.employee.findMany({
        where: { status: 'ACTIVE', joinDate: { lte: twoYearsAgo } },
        select: { id: true, name: true, nik: true, joinDate: true },
      }),
      this.prisma.attendance.findMany({
        where: { date: { gte: threeMonthsAgo }, status: 'ALPHA' },
        include: { employee: { select: { id: true, name: true } } },
      }),
    ]);

    return {
      decliningPerformance: decliningPerformance.map((p) => ({ employee: p.employee, score: p.totalScore, period: p.period })),
      contractExpiring,
      noRaiseLongTerm: noRaiseLongTerm.map((e) => ({ employee: e, joinDate: e.joinDate })),
      highAbsence: highAbsence.map((a) => ({ employee: a.employee, date: a.date })),
    };
  }

  async getResults(type?: string) {
    return this.prisma.spkResult.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
