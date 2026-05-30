import { IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreatePerformanceDto {
  @IsNumber()
  employeeId: number;

  @IsString()
  period: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  kpiScore: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  selfScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  review360Score?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
