import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreatePositionDto } from './dto/create-position.dto';

@ApiTags('Positions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('positions')
export class PositionsController {
  constructor(private service: PositionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all positions' })
  @ApiQuery({ name: 'departmentId', required: false })
  findAll(@Query('departmentId') departmentId?: string) {
    return this.service.findAll(departmentId ? +departmentId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get position detail' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Create position' })
  create(@Body() dto: CreatePositionDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Update position' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreatePositionDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete position' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
