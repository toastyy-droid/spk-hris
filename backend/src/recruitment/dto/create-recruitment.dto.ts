import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateRecruitmentDto {
  @IsNumber()
  positionId: number;

  @IsString()
  candidateName: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateStageDto {
  @IsString()
  stage: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ScoreCandidateDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  scoreExperience: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  scoreEducation: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  scoreInterview: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  scoreSoftskill: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  scoreSalary: number;
}
