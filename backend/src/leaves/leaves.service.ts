import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  findAll(employeeId?: number, status?: string) {
    return this.prisma.leave.findMany({
      where: {
        ...(employeeId ? { employeeId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        employee: { select: { id: true, name: true, nik: true } },
        approver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.leave.findUnique({ where: { id }, include: { employee: true, approver: true } });
  }

  async create(data: { employeeId: number; type: string; startDate: string; endDate: string; reason?: string }) {
    return this.prisma.leave.create({
      data: {
        employeeId: data.employeeId,
        type: data.type as any,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
      },
    });
  }

  async approve(id: number, approverId: number) {
    await this.prisma.leave.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.leave.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy: approverId, approvedAt: new Date() },
    });
  }

  async reject(id: number, approverId: number) {
    await this.prisma.leave.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.leave.update({
      where: { id },
      data: { status: 'REJECTED', approvedBy: approverId, approvedAt: new Date() },
    });
  }

  async getQuota(employeeId: number) {
    const year = new Date().getFullYear();
    const leaves = await this.prisma.leave.findMany({
      where: {
        employeeId,
        startDate: { gte: new Date(`${year}-01-01`) },
        status: 'APPROVED',
      },
    });
    const used = leaves.reduce((sum, l) => {
      const days = Math.ceil((l.endDate.getTime() - l.startDate.getTime()) / (86400000)) + 1;
      return sum + days;
    }, 0);
    return { annualQuota: 12, used, remaining: 12 - used };
  }
}
