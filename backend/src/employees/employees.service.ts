import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string, departmentId?: number, status?: string) {
    return this.prisma.employee.findMany({
      where: {
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { nik: { contains: search } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
        ...(departmentId ? { departmentId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        department: { select: { id: true, name: true } },
        position: { select: { id: true, name: true, level: true } },
        user: { select: { id: true, username: true, role: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        user: { select: { id: true, username: true, role: true } },
        attendances: { take: 30, orderBy: { date: 'desc' } },
        leaves: { take: 10, orderBy: { createdAt: 'desc' } },
        payrolls: { take: 12, orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }] },
        performances: { take: 6, orderBy: { period: 'desc' } },
        trainings: { take: 10, orderBy: { date: 'desc' } },
        skills: { include: { skill: true } },
        documents: true,
      },
    });
  }

  async create(dto: CreateEmployeeDto) {
    const data: any = { ...dto };
    if (dto.birthDate) data.birthDate = new Date(dto.birthDate);
    if (dto.joinDate) data.joinDate = new Date(dto.joinDate);
    if (dto.contractEnd) data.contractEnd = new Date(dto.contractEnd);
    return this.prisma.employee.create({ data });
  }

  async update(id: number, dto: Partial<CreateEmployeeDto>) {
    await this.prisma.employee.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    const data: any = { ...dto };
    if (dto.birthDate) data.birthDate = new Date(dto.birthDate);
    if (dto.joinDate) data.joinDate = new Date(dto.joinDate);
    if (dto.contractEnd) data.contractEnd = new Date(dto.contractEnd);
    return this.prisma.employee.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.prisma.employee.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.employee.delete({ where: { id } });
  }

  async getStats() {
    const [total, active, byDept, byStatus, contractExpiring] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.count({ where: { status: 'ACTIVE' } }),
      this.prisma.department.findMany({
        select: { name: true, _count: { select: { employees: true } } },
      }),
      this.prisma.employee.groupBy({ by: ['status'], _count: true }),
      this.prisma.employee.findMany({
        where: {
          contractEnd: { lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
          status: 'ACTIVE',
        },
        select: { id: true, name: true, nik: true, contractEnd: true },
        orderBy: { contractEnd: 'asc' },
      }),
    ]);
    return { total, active, byDept, byStatus, contractExpiring };
  }
}
