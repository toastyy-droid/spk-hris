import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  findAll(departmentId?: number) {
    return this.prisma.position.findMany({
      where: departmentId ? { departmentId } : undefined,
      include: { department: true, _count: { select: { employees: true } } },
    });
  }

  findOne(id: number) {
    return this.prisma.position.findUnique({
      where: { id },
      include: { department: true, employees: true },
    });
  }

  create(data: { name: string; level: string; departmentId: number }) {
    return this.prisma.position.create({ data });
  }

  async update(id: number, data: Partial<{ name: string; level: string; departmentId: number }>) {
    await this.prisma.position.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.position.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.prisma.position.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.position.delete({ where: { id } });
  }
}
