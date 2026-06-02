import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max, IsString, IsEnum } from 'class-validator';
import { ShippingCoverage } from '@prisma/client';

export class RunPromotionDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  threshold?: number;
}

export class RunSupplierSelectionDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  threshold?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  productBrand?: string;
}

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  productBrand?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  priceScore: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  qualityScore: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  deliveryScore: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  serviceScore: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  capacityScore: number;

  @IsOptional()
  @IsEnum(ShippingCoverage)
  shippingCoverage?: ShippingCoverage;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSupplierDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  productBrand?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  priceScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  qualityScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  deliveryScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  serviceScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  capacityScore?: number;

  @IsOptional()
  @IsEnum(ShippingCoverage)
  shippingCoverage?: ShippingCoverage;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
