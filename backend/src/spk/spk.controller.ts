import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SpkService } from './spk.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateSupplierDto, RunPromotionDto, RunSupplierSelectionDto, UpdateSupplierDto } from './dto/create-spk.dto';

@ApiTags('SPK')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('spk')
export class SpkController {
  constructor(private service: SpkService) {}

  @Post('promotion')
  @Roles('SUPER_ADMIN', 'ADMIN_HR', 'MANAGER')
  @ApiOperation({ summary: 'Run SPK promotion recommendation' })
  runPromotion(@Body() dto: RunPromotionDto) {
    return this.service.promotionCandidates(dto.departmentId, dto.threshold);
  }

  @Get('suppliers')
  @Roles('SUPER_ADMIN', 'ADMIN_HR', 'MANAGER', 'KARYAWAN')
  @ApiOperation({ summary: 'Get supplier alternatives for SPK' })
  getSuppliers(@Query('category') category?: string, @Query('brand') brand?: string) {
    return this.service.getSuppliers(category, brand);
  }

  @Post('suppliers')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Create supplier alternative' })
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.service.createSupplier(dto);
  }

  @Patch('suppliers/:id')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Update supplier alternative' })
  updateSupplier(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplierDto) {
    return this.service.updateSupplier(id, dto);
  }

  @Delete('suppliers/:id')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Delete supplier alternative' })
  deleteSupplier(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteSupplier(id);
  }

  @Post('supplier-selection')
  @Roles('SUPER_ADMIN', 'ADMIN_HR', 'MANAGER')
  @ApiOperation({ summary: 'Run SPK supplier selection recommendation' })
  runSupplierSelection(@Body() dto: RunSupplierSelectionDto) {
    return this.service.supplierSelection(dto.category, dto.threshold, dto.productBrand);
  }

  @Get('early-warnings')
  @Roles('SUPER_ADMIN', 'ADMIN_HR', 'MANAGER')
  @ApiOperation({ summary: 'Get early warning flags' })
  earlyWarnings() { return this.service.earlyWarnings(); }

  @Get('results')
  @Roles('SUPER_ADMIN', 'ADMIN_HR', 'MANAGER', 'KARYAWAN')
  @ApiOperation({ summary: 'Get SPK historical results' })
  getResults(@Query('type') type?: string) { return this.service.getResults(type); }

  @Patch('results/:id')
  @Roles('SUPER_ADMIN', 'ADMIN_HR')
  @ApiOperation({ summary: 'Update SPK result (approve/reject)' })
  updateResult(@Param('id', ParseIntPipe) id: number, @Body() dto: { status?: string; notes?: string }) {
    return this.service.updateResult(id, dto);
  }
}
