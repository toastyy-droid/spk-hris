import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.skill.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { name: 'asc' },
    });
  }

  create(name: string, category?: string) {
    return this.prisma.skill.create({ data: { name, category } });
  }

  async assignSkill(employeeId: number, skillId: number, proficiency: number) {
    return this.prisma.skillMatrix.upsert({
      where: { employeeId_skillId: { employeeId, skillId } },
      create: { employeeId, skillId, proficiency },
      update: { proficiency, lastUpdated: new Date() },
    });
  }

  getEmployeeSkills(employeeId: number) {
    return this.prisma.skillMatrix.findMany({
      where: { employeeId },
      include: { skill: true },
      orderBy: { skill: { name: 'asc' } },
    });
  }

  removeSkill(employeeId: number, skillId: number) {
    return this.prisma.skillMatrix.delete({
      where: { employeeId_skillId: { employeeId, skillId } },
    });
  }
}
