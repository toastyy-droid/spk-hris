import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  nik: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}
