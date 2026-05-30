import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
      include: { employee: true },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      accessToken: this.jwt.sign({
        sub: user.id,
        username: user.username,
        role: user.role,
        employeeId: user.employee?.id,
      }),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        employeeId: user.employee?.id,
        employeeName: user.employee?.name,
      },
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (exists) throw new ConflictException('Username already exists');

    const emailExists = await this.prisma.employee.findUnique({
      where: { email: dto.email },
    });
    if (emailExists) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const dept = await tx.department.findFirst();
      const pos = await tx.position.findFirst();
      if (!dept || !pos) throw new Error('Seed departments/positions first');

      const user = await tx.user.create({
        data: {
          username: dto.username,
          password: hashed,
          role: dto.role ?? 'KARYAWAN',
        },
      });

      await tx.employee.create({
        data: {
          nik: dto.nik,
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          departmentId: dept.id,
          positionId: pos.id,
          userId: user.id,
        },
      });

      return user;
    });

    return {
      id: result.id,
      username: result.username,
      role: result.role,
    };
  }

  async getProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        lastLogin: true,
        employee: {
          select: {
            id: true,
            nik: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            joinDate: true,
            status: true,
            department: true,
            position: true,
          },
        },
      },
    });
  }
}
