import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private service: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'List all employees' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(search, departmentId ? +departmentId : undefined, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Employee statistics' })
  getStats() { return this.service.getStats(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee detail (with all relations)' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Create employee' })
  create(@Body() dto: CreateEmployeeDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Update employee' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateEmployeeDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete employee' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
