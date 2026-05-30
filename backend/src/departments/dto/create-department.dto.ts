import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  managerId?: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
