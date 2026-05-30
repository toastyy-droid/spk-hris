import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  findAll(employeeId?: number, month?: number, year?: number) {
    return this.prisma.payroll.findMany({
      where: {
        ...(employeeId ? { employeeId } : {}),
        ...(month ? { periodMonth: month } : {}),
        ...(year ? { periodYear: year } : {}),
      },
      include: { employee: { select: { id: true, name: true, nik: true, department: true } } },
      orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.payroll.findUnique({ where: { id }, include: { employee: true } });
  }

  async processMonthly(month: number, year: number) {
    const employees = await this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      include: { position: true },
    });

    const results = [];
    for (const emp of employees) {
      const existing = await this.prisma.payroll.findUnique({
        where: { employeeId_periodMonth_periodYear: { employeeId: emp.id, periodMonth: month, periodYear: year } },
      });
      if (existing) continue;

      const basicSalary = 5000000;
      const allowanceTransport = 500000;
      const allowanceMeal = 300000;
      const allowanceHealth = 200000;
      const allowancePosition = emp.position.level === 'MANAGER' ? 1000000 : 0;

      const gross = basicSalary + allowanceTransport + allowanceMeal + allowanceHealth + allowancePosition;
      const deductionBpjsTk = gross * 0.02;
      const deductionBpjsKes = gross * 0.01;
      const deductionPph21 = gross > 10000000 ? gross * 0.05 : 0;
      const netSalary = gross - deductionBpjsTk - deductionBpjsKes - deductionPph21;

      const payroll = await this.prisma.payroll.create({
        data: {
          employeeId: emp.id,
          periodMonth: month,
          periodYear: year,
          basicSalary,
          allowanceTransport,
          allowanceMeal,
          allowanceHealth,
          allowancePosition,
          overtimePay: 0,
          deductionLate: 0,
          deductionLoan: 0,
          deductionBpjsTk,
          deductionBpjsKes,
          deductionPph21,
          thrAmount: 0,
          netSalary,
          status: 'DRAFT',
        },
      });
      results.push(payroll);
    }
    return results;
  }

  async updatePayroll(id: number, data: Partial<{
    basicSalary: number; allowanceTransport: number; allowanceMeal: number;
    allowanceHealth: number; allowancePosition: number; overtimePay: number;
    deductionLate: number; deductionLoan: number; thrAmount: number;
    netSalary: number; status: string; notes: string;
  }>) {
    await this.prisma.payroll.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.payroll.update({ where: { id }, data: data as any });
  }

  async markPaid(ids: number[]) {
    return this.prisma.payroll.updateMany({
      where: { id: { in: ids } },
      data: { status: 'PAID', paidAt: new Date() },
    });
  }

  async getMonthlySummary(month: number, year: number) {
    const payrolls = await this.prisma.payroll.findMany({
      where: { periodMonth: month, periodYear: year },
      include: { employee: { include: { department: true } } },
    });

    const totalGross = payrolls.reduce((s, p) => s + Number(p.basicSalary) + Number(p.allowanceTransport ?? 0) + Number(p.allowanceMeal ?? 0) + Number(p.allowanceHealth ?? 0) + Number(p.allowancePosition ?? 0) + Number(p.overtimePay ?? 0), 0);
    const totalDeduction = payrolls.reduce((s, p) => s + Number(p.deductionLate ?? 0) + Number(p.deductionLoan ?? 0) + Number(p.deductionBpjsTk ?? 0) + Number(p.deductionBpjsKes ?? 0) + Number(p.deductionPph21 ?? 0), 0);
    const totalNet = payrolls.reduce((s, p) => s + Number(p.netSalary), 0);

    const byDept: Record<string, number> = {};
    payrolls.forEach((p) => {
      const dept = p.employee.department.name;
      byDept[dept] = (byDept[dept] || 0) + Number(p.netSalary);
    });

    return {
      count: payrolls.length,
      totalGross,
      totalDeduction,
      totalNet,
      byDepartment: byDept,
      payrolls,
    };
  }
}
