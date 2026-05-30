import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.department.findMany({
      include: { manager: { select: { id: true, name: true } }, _count: { select: { employees: true } } },
    });
  }

  findOne(id: number) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        manager: { select: { id: true, name: true } },
        employees: { include: { position: true } },
        positions: true,
        children: true,
      },
    });
  }

  create(dto: CreateDepartmentDto) {
    return this.prisma.department.create({ data: dto });
  }

  async update(id: number, dto: Partial<CreateDepartmentDto>) {
    await this.prisma.department.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.department.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.prisma.department.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.department.delete({ where: { id } });
  }

  tree() {
    return this.prisma.department.findMany({
      where: { parentId: null },
      include: { children: { include: { children: true } } },
    });
  }
}
