import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return {
      ...user,
      profile: user.profile ? { ...user.profile, avatar: null } : null,
    };
  }

  async updateProfile(
    userId: number,
    data: { fullName?: string; phone?: string; country?: string; avatar?: string },
  ) {
    const { avatar, ...profileData } = data;
    return this.prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        fullName: profileData.fullName || '',
        phone: profileData.phone,
        country: profileData.country,
      },
      update: profileData,
    });
  }

  async getAllUsers(limit = 10, skip = 0) {
    return this.prisma.user.findMany({
      skip,
      take: limit,
      include: { profile: true },
    });
  }

  async getUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }

  async updateUserRole(userId: number, role: 'USER' | 'ADMIN' | 'SUPERADMIN') {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, username: true, email: true, role: true },
    });
  }

  async deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
