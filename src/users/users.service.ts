import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}


  async getUserProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }


  async updateProfile(userId: number, data: { fullName?: string; phone?: string; country?: string }) {
    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, fullName: data.fullName || '', phone: data.phone, country: data.country },
      update: data,
    });
  }


  async getAllUsers(limit = 10, skip = 0) {
    return this.prisma.user.findMany({
      skip,
      take: limit,
      include: { profile: true },
    });
  }

  
  async deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
