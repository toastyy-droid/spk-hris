import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private service: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all departments' })
  findAll() { return this.service.findAll(); }

  @Get('tree')
  @ApiOperation({ summary: 'Get org chart tree' })
  tree() { return this.service.tree(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get department detail' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Create department' })
  create(@Body() dto: CreateDepartmentDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Update department' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateDepartmentDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete department' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
