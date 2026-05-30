import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  findAll(employeeId?: number, dateFrom?: string, dateTo?: string) {
    return this.prisma.attendance.findMany({
      where: {
        ...(employeeId ? { employeeId } : {}),
        ...(dateFrom || dateTo ? {
          date: {
            ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
            ...(dateTo ? { lte: new Date(dateTo) } : {}),
          },
        } : {}),
      },
      include: { employee: { select: { id: true, name: true, nik: true } } },
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.attendance.findUnique({
      where: { id },
      include: { employee: true },
    });
  }

  async checkIn(employeeId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await this.prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });
    if (existing) throw new Error('Already checked in today');
    return this.prisma.attendance.create({
      data: { employeeId, date: today, checkIn: new Date(), status: 'HADIR' },
    });
  }

  async checkOut(employeeId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const record = await this.prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });
    if (!record) throw new NotFoundException('No check-in found for today');
    if (record.checkOut) throw new Error('Already checked out');
    return this.prisma.attendance.update({
      where: { id: record.id },
      data: { checkOut: new Date() },
    });
  }

  async update(id: number, data: Partial<{ status: string; checkIn: string; checkOut: string; overtimeHours: number; notes: string }>) {
    await this.prisma.attendance.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    const updateData: any = { ...data };
    if (data.checkIn) updateData.checkIn = new Date(data.checkIn);
    if (data.checkOut) updateData.checkOut = new Date(data.checkOut);
    return this.prisma.attendance.update({ where: { id }, data: updateData });
  }

  async getTodaySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tom = new Date(today);
    tom.setDate(tom.getDate() + 1);
    const records = await this.prisma.attendance.findMany({
      where: { date: { gte: today, lt: tom } },
    });
    return {
      total: records.length,
      hadir: records.filter((r) => r.status === 'HADIR').length,
      izin: records.filter((r) => r.status === 'IZIN').length,
      sakit: records.filter((r) => r.status === 'SAKIT').length,
      cuti: records.filter((r) => r.status === 'CUTI').length,
      alpha: records.filter((r) => r.status === 'ALPHA').length,
    };
  }

  async getMonthlySummary(year: number, month: number) {
    const records = await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: { employee: { select: { id: true, name: true, nik: true, department: true } } },
    });
    return records;
  }
}
