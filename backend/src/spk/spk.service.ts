import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SpkService {
  constructor(private prisma: PrismaService) {}

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
