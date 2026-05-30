import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateSkillDto, AssignSkillDto } from './dto/create-skill.dto';

@ApiTags('Skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('skills')
export class SkillsController {
  constructor(private service: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'List all skills' })
  findAll() { return this.service.findAll(); }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Create skill' })
  create(@Body() dto: CreateSkillDto) { return this.service.create(dto.name, dto.category); }

  @Post('assign')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Assign skill to employee' })
  assign(@Body() dto: AssignSkillDto) {
    return this.service.assignSkill(dto.employeeId, dto.skillId, dto.proficiency);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get employee skill matrix' })
  getEmployeeSkills(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.service.getEmployeeSkills(employeeId);
  }

  @Delete('assign')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Remove skill from employee' })
  removeSkill(@Query('employeeId', ParseIntPipe) employeeId: number, @Query('skillId', ParseIntPipe) skillId: number) {
    return this.service.removeSkill(employeeId, skillId);
  }
}
