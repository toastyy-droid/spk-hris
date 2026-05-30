import { IsString, IsNumber } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  name: string;

  @IsString()
  level: string;

  @IsNumber()
  departmentId: number;
}
