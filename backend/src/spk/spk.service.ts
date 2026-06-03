import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/create-spk.dto';

@Injectable()
export class SpkService {
  constructor(private prisma: PrismaService) {}

  private readonly WEIGHTS = { price: 0.3, quality: 0.3, delivery: 0.2, service: 0.1, capacity: 0.1 };
  private readonly COST_CRITERIA = ['price'];
  private readonly BENEFIT_CRITERIA = ['quality', 'delivery', 'service', 'capacity'];

  private sawNormalizeAndScore(
    raw: { price: number; quality: number; delivery: number; service: number; capacity: number },
    minPrice: number,
    maxValues: { quality: number; delivery: number; service: number; capacity: number },
    hasBonus: boolean,
  ) {
    const normalized = {
      price: minPrice / raw.price,
      quality: raw.quality / maxValues.quality,
      delivery: raw.delivery / maxValues.delivery,
      service: raw.service / maxValues.service,
      capacity: raw.capacity / maxValues.capacity,
    };

    let total =
      normalized.price * this.WEIGHTS.price +
      normalized.quality * this.WEIGHTS.quality +
      normalized.delivery * this.WEIGHTS.delivery +
      normalized.service * this.WEIGHTS.service +
      normalized.capacity * this.WEIGHTS.capacity;

    if (hasBonus) {
      total += 0.05;
    }

    return {
      normalized,
      total: Math.round(total * 10000) / 10000,
      bonus: hasBonus ? 0.05 : 0,
    };
  }

  private supplierPayload(data: CreateSupplierDto): Prisma.SupplierCreateInput {
    return {
      name: data.name,
      category: data.category,
      productBrand: data.productBrand,
      contactPerson: data.contactPerson,
      phone: data.phone,
      address: data.address,
      priceScore: data.priceScore,
      qualityScore: data.qualityScore,
      deliveryScore: data.deliveryScore,
      serviceScore: data.serviceScore,
      capacityScore: data.capacityScore,
      shippingCoverage: data.shippingCoverage,
      status: data.status,
      notes: data.notes,
      totalScore: undefined,
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
      priceScore: Number(supplier.priceScore),
      qualityScore: Number(supplier.qualityScore),
      deliveryScore: Number(supplier.deliveryScore),
      serviceScore: Number(supplier.serviceScore),
      capacityScore: Number(supplier.capacityScore),
      totalScore: supplier.totalScore === null ? null : Number(supplier.totalScore),
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

    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...data,
        totalScore: null,
      },
    });
  }

  async deleteSupplier(id: number) {
    const existing = await this.prisma.supplier.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Supplier not found');
    await this.prisma.supplier.delete({ where: { id } });
    return { id };
  }

  async supplierSelection(category?: string, threshold = 0.75, productBrand?: string) {
    const suppliers = await this.prisma.supplier.findMany({
      where: {
        status: { in: ['ACTIVE', 'RECOMMENDED'] },
        ...(category ? { category: { contains: category, mode: 'insensitive' as const } } : {}),
        ...(productBrand ? { productBrand: { contains: productBrand, mode: 'insensitive' as const } } : {}),
      },
    });

    if (suppliers.length === 0) {
      return { threshold, weights: this.WEIGHTS, criterionType: { ...this.COST_CRITERIA.reduce((a, c) => ({ ...a, [c]: 'cost' }), {}), ...this.BENEFIT_CRITERIA.reduce((a, c) => ({ ...a, [c]: 'benefit' }), {}) }, suppliers: [] };
    }

    const raw = suppliers.map((s) => ({
      id: s.id,
      price: Number(s.priceScore) / 10,
      quality: Number(s.qualityScore) / 10,
      delivery: Number(s.deliveryScore) / 10,
      service: Number(s.serviceScore) / 10,
      capacity: Number(s.capacityScore) / 10,
    }));

    const minPrice = Math.min(...raw.map((r) => r.price));
    const maxValues = {
      quality: Math.max(...raw.map((r) => r.quality)),
      delivery: Math.max(...raw.map((r) => r.delivery)),
      service: Math.max(...raw.map((r) => r.service)),
      capacity: Math.max(...raw.map((r) => r.capacity)),
    };

    const results = suppliers
      .map((supplier, i) => {
        const r = raw[i];
        const calc = this.sawNormalizeAndScore(
          r,
          minPrice,
          maxValues,
          supplier.shippingCoverage === 'SUPPLIER_COVERS',
        );

        return {
          supplierId: supplier.id,
          name: supplier.name,
          category: supplier.category,
          productBrand: supplier.productBrand,
          contactPerson: supplier.contactPerson,
          phone: supplier.phone,
          priceScore: Number(supplier.priceScore),
          qualityScore: Number(supplier.qualityScore),
          deliveryScore: Number(supplier.deliveryScore),
          serviceScore: Number(supplier.serviceScore),
          capacityScore: Number(supplier.capacityScore),
          normalizedPrice: Math.round(calc.normalized.price * 10000) / 10000,
          normalizedQuality: Math.round(calc.normalized.quality * 10000) / 10000,
          normalizedDelivery: Math.round(calc.normalized.delivery * 10000) / 10000,
          normalizedService: Math.round(calc.normalized.service * 10000) / 10000,
          normalizedCapacity: Math.round(calc.normalized.capacity * 10000) / 10000,
          shippingCoverage: supplier.shippingCoverage,
          bonus: calc.bonus,
          totalScore: calc.total,
          recommended: calc.total >= threshold,
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

    const criterionType = {
      price: 'cost',
      quality: 'benefit',
      delivery: 'benefit',
      service: 'benefit',
      capacity: 'benefit',
    };

    return {
      threshold,
      weights: this.WEIGHTS,
      criterionType,
      suppliers: suppliersWithResultId,
    };
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
