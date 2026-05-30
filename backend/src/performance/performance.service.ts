import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PerformanceService {
  constructor(private prisma: PrismaService) {}

  findAll(employeeId?: number, period?: string) {
    return this.prisma.performance.findMany({
      where: {
        ...(employeeId ? { employeeId } : {}),
        ...(period ? { period } : {}),
      },
      include: { employee: { select: { id: true, name: true, nik: true, department: true } } },
      orderBy: { period: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.performance.findUnique({ where: { id }, include: { employee: true } });
  }

  async createOrUpdate(data: {
    employeeId: number; period: string; kpiScore: number;
    selfScore?: number; review360Score?: number; notes?: string;
  }) {
    const totalScore = Number((
      (data.kpiScore * 0.4) +
      (data.selfScore ?? 0) * 0.2 +
      (data.review360Score ?? 0) * 0.4
    ).toFixed(2));

    let grade = 'D';
    if (totalScore >= 90) grade = 'A';
    else if (totalScore >= 75) grade = 'B';
    else if (totalScore >= 60) grade = 'C';

    return this.prisma.performance.upsert({
      where: { employeeId_period: { employeeId: data.employeeId, period: data.period } },
      create: { ...data, totalScore, grade },
      update: { ...data, totalScore, grade },
    });
  }

  async remove(id: number) {
    await this.prisma.performance.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.performance.delete({ where: { id } });
  }
}
