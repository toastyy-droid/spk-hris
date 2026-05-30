import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RecruitmentService } from './recruitment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateRecruitmentDto, UpdateStageDto, ScoreCandidateDto } from './dto/create-recruitment.dto';

@ApiTags('Recruitment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('recruitment')
export class RecruitmentController {
  constructor(private service: RecruitmentService) {}

  @Get()
  @ApiOperation({ summary: 'List candidates' })
  findAll(@Query('stage') stage?: string) { return this.service.findAll(stage); }

  @Get('pipeline')
  @ApiOperation({ summary: 'Pipeline summary by stage' })
  getPipeline() { return this.service.getPipeline(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get candidate detail' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create candidate record' })
  create(@Body() dto: CreateRecruitmentDto) {
    return this.service.create(dto);
  }

  @Patch(':id/stage')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Move candidate to next stage' })
  updateStage(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStageDto) {
    return this.service.updateStage(id, dto.stage, dto as any);
  }

  @Post(':id/score')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Score candidate (SPK weighted)' })
  score(@Param('id', ParseIntPipe) id: number, @Body() dto: ScoreCandidateDto) {
    return this.service.scoreCandidate(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete candidate' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
