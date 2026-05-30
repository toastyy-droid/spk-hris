import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TrainingService {
  constructor(private prisma: PrismaService) {}

  findAll(employeeId?: number) {
    return this.prisma.training.findMany({
      where: employeeId ? { employeeId } : undefined,
      include: { employee: { select: { id: true, name: true, nik: true } } },
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.training.findUnique({ where: { id }, include: { employee: true } });
  }

  create(data: { employeeId: number; name: string; provider?: string; date: string; cost?: number; duration?: number; notes?: string }) {
    return this.prisma.training.create({
      data: {
        employeeId: data.employeeId,
        name: data.name,
        provider: data.provider,
        date: new Date(data.date),
        cost: data.cost,
        duration: data.duration,
        notes: data.notes,
      },
    });
  }

  async update(id: number, data: Partial<{ name: string; provider: string; date: string; cost: number; duration: number; notes: string; certificate: string }>) {
    await this.prisma.training.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    const updateData: any = { ...data };
    if (data.date) updateData.date = new Date(data.date);
    return this.prisma.training.update({ where: { id }, data: updateData });
  }

  async remove(id: number) {
    await this.prisma.training.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.training.delete({ where: { id } });
  }
}
