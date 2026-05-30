import { IsString, IsOptional } from 'class-validator';

export class CreateLeaveDto {
  @IsString()
  type: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
