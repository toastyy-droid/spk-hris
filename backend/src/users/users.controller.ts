import { Controller, Get, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all users' })
  findAll() { return this.service.findAll(); }

  @Patch(':id/role')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update user role' })
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: { role: string }) {
    return this.service.updateRole(id, dto.role);
  }

  @Patch(':id/reset-password')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Reset user password' })
  resetPassword(@Param('id', ParseIntPipe) id: number, @Body() dto: { password: string }) {
    return this.service.resetPassword(id, dto.password);
  }
}
