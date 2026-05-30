import { Module } from '@nestjs/common';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LeavesController],
  providers: [LeavesService, PrismaService],
})
export class LeavesModule {}
