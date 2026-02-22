import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    return { id: user.id, username: user.username, email: user.email };
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }

  async validateUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, role: true },
    });
  }
}