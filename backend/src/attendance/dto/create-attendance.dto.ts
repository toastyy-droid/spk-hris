import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  checkIn?: string;

  @IsOptional()
  @IsString()
  checkOut?: string;

  @IsOptional()
  @IsNumber()
  overtimeHours?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
