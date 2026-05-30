import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ProcessPayrollDto, MarkPaidDto } from './dto/create-payroll.dto';

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private service: PayrollService) {}

  @Get()
  @ApiOperation({ summary: 'List payroll records' })
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.service.findAll(employeeId ? +employeeId : undefined, month ? +month : undefined, year ? +year : undefined);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Monthly payroll summary' })
  @Roles('SUPER_ADMIN', 'ADMIN_HR', 'MANAGER')
  getSummary(@Query('month', ParseIntPipe) month: number, @Query('year', ParseIntPipe) year: number) {
    return this.service.getMonthlySummary(month, year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payroll detail' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post('process')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Process monthly payroll for all active employees' })
  processMonthly(@Body() dto: ProcessPayrollDto) {
    return this.service.processMonthly(dto.month, dto.year);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Update payroll record' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.updatePayroll(id, data);
  }

  @Post('mark-paid')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Mark payrolls as paid' })
  markPaid(@Body() dto: MarkPaidDto) {
    return this.service.markPaid(dto.ids);
  }
}
