import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateAttendanceDto } from './dto/create-attendance.dto';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private service: AttendanceService) {}

  @Get()
  @ApiOperation({ summary: 'List attendance records' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'year', required: false })
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    if (month && year) {
      const m = +month;
      const y = +year;
      dateFrom = new Date(y, m - 1, 1).toISOString();
      dateTo = new Date(y, m, 0, 23, 59, 59).toISOString();
    }
    return this.service.findAll(employeeId ? +employeeId : undefined, dateFrom, dateTo);
  }

  @Get('summary/today')
  @ApiOperation({ summary: 'Today attendance summary' })
  getTodaySummary() { return this.service.getTodaySummary(); }

  @Get('summary/monthly')
  @ApiOperation({ summary: 'Monthly attendance detail' })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'month', required: true })
  getMonthlySummary(@Query('year', ParseIntPipe) year: number, @Query('month', ParseIntPipe) month: number) {
    return this.service.getMonthlySummary(year, month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance record' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post('checkin')
  @ApiOperation({ summary: 'Check in today' })
  checkIn(@CurrentUser('employeeId') employeeId: number) {
    return this.service.checkIn(employeeId);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Check out today' })
  checkOut(@CurrentUser('employeeId') employeeId: number) {
    return this.service.checkOut(employeeId);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Update attendance record' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAttendanceDto) {
    return this.service.update(id, dto as any);
  }
}
