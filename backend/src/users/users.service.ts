import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, role: true, isActive: true, lastLogin: true, employee: { select: { name: true } } },
      orderBy: { username: 'asc' },
    });
  }

  async updateRole(id: number, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: { id: true, username: true, role: true },
    });
  }

  async resetPassword(id: number, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashed },
      select: { id: true, username: true },
    });
  }
}
