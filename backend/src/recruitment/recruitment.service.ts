import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RecruitmentService {
  constructor(private prisma: PrismaService) {}

  findAll(stage?: string) {
    return this.prisma.recruitment.findMany({
      where: stage ? { stage: stage as any } : undefined,
      include: { position: { include: { department: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.recruitment.findUnique({
      where: { id },
      include: { position: { include: { department: true } } },
    });
  }

  create(data: {
    positionId: number; candidateName: string; email: string;
    phone?: string; notes?: string;
  }) {
    return this.prisma.recruitment.create({ data: { ...data, stage: 'SCREENING' } });
  }

  async updateStage(id: number, stage: string, data?: Record<string, any>) {
    await this.prisma.recruitment.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    const updateData: any = { stage: stage as any, ...data };
    if (stage === 'INTERVIEW') updateData.interviewDate = new Date();
    if (stage === 'OFFERING') updateData.offerDate = new Date();
    if (stage === 'ONBOARDING') updateData.onboardingDate = new Date();
    if (stage === 'HIRED') updateData.onboardingDate = new Date();
    return this.prisma.recruitment.update({ where: { id }, data: updateData });
  }

  async scoreCandidate(id: number, scores: {
    scoreExperience: number; scoreEducation: number;
    scoreInterview: number; scoreSoftskill: number; scoreSalary: number;
  }) {
    const total = Number((
      scores.scoreExperience * 0.3 +
      scores.scoreEducation * 0.25 +
      scores.scoreInterview * 0.25 +
      scores.scoreSoftskill * 0.10 +
      scores.scoreSalary * 0.10
    ).toFixed(2));

    return this.prisma.recruitment.update({
      where: { id },
      data: { ...scores, totalScore: total },
    });
  }

  async remove(id: number) {
    await this.prisma.recruitment.findUniqueOrThrow({ where: { id } }).catch(() => { throw new NotFoundException(); });
    return this.prisma.recruitment.delete({ where: { id } });
  }

  getPipeline() {
    return this.prisma.recruitment.groupBy({
      by: ['stage'],
      _count: true,
    });
  }
}
