import { Module } from '@nestjs/common';
import { SpkController } from './spk.controller';
import { SpkService } from './spk.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SpkController],
  providers: [SpkService, PrismaService],
})
export class SpkModule {}
