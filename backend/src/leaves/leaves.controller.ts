import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LeavesService } from './leaves.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateLeaveDto } from './dto/create-leave.dto';

@ApiTags('Leaves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private service: LeavesService) {}

  @Get()
  @ApiOperation({ summary: 'List leave requests' })
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(employeeId ? +employeeId : undefined, status);
  }

  @Get('quota')
  @ApiOperation({ summary: 'Get my leave quota' })
  getQuota(@CurrentUser('employeeId') employeeId: number) {
    return this.service.getQuota(employeeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave detail' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Submit leave request' })
  create(@CurrentUser('employeeId') employeeId: number, @Body() dto: CreateLeaveDto) {
    return this.service.create({ ...dto, employeeId });
  }

  @Patch(':id/approve')
  @Roles('SUPER_ADMIN', 'ADMIN_HR', 'MANAGER')
  @ApiOperation({ summary: 'Approve leave' })
  approve(@Param('id', ParseIntPipe) id: number, @CurrentUser('employeeId') approverId: number) {
    return this.service.approve(id, approverId);
  }

  @Patch(':id/reject')
  @Roles('SUPER_ADMIN', 'ADMIN_HR', 'MANAGER')
  @ApiOperation({ summary: 'Reject leave' })
  reject(@Param('id', ParseIntPipe) id: number, @CurrentUser('employeeId') approverId: number) {
    return this.service.reject(id, approverId);
  }
}
