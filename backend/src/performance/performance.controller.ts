import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreatePerformanceDto } from './dto/create-performance.dto';

@ApiTags('Performance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('performance')
export class PerformanceController {
  constructor(private service: PerformanceService) {}

  @Get()
  @ApiOperation({ summary: 'List performance records' })
  findAll(@Query('employeeId') employeeId?: string, @Query('period') period?: string) {
    return this.service.findAll(employeeId ? +employeeId : undefined, period);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get performance detail' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create or update performance (upsert by employee+period)' })
  createOrUpdate(@Body() dto: CreatePerformanceDto) {
    return this.service.createOrUpdate(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete performance record' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
