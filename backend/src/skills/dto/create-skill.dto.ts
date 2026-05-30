import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class AssignSkillDto {
  @IsNumber()
  employeeId: number;

  @IsNumber()
  skillId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  proficiency: number;
}
