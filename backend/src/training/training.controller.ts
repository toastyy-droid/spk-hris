import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TrainingService } from './training.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateTrainingDto, UpdateTrainingDto } from './dto/create-training.dto';

@ApiTags('Training')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('training')
export class TrainingController {
  constructor(private service: TrainingService) {}

  @Get()
  @ApiOperation({ summary: 'List training records' })
  findAll(@Query('employeeId') employeeId?: string) {
    return this.service.findAll(employeeId ? +employeeId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get training detail' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Create training record' })
  create(@Body() dto: CreateTrainingDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Update training record' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTrainingDto) { return this.service.update(id, dto as any); }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete training record' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
