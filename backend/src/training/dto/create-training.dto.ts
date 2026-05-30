import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTrainingDto {
  @IsNumber()
  employeeId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsString()
  date: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTrainingDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  certificate?: string;
}
