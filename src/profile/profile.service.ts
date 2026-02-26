import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(userId: number, dto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: {
        userId,
        fullName: dto.fullName,
        phone: dto.phone,
        country: dto.country,
        avatarUrl: dto.avatarUrl,
      },
    });
  }

  async getMyProfile(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getAllProfiles() {
    return this.prisma.profile.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async getProfileByUserId(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateMyProfile(userId: number, dto: UpdateProfileDto) {
    return this.prisma.profile.upsert({
      where: { userId },
      update: {
        fullName: dto.fullName,
        phone: dto.phone,
        country: dto.country,
        avatarUrl: dto.avatarUrl,
      },
      create: {
        userId,
        fullName: dto.fullName,
        phone: dto.phone,
        country: dto.country,
        avatarUrl: dto.avatarUrl,
      },
    });
  }

  async deleteMyProfile(userId: number) {
    return this.prisma.profile.delete({
      where: { userId },
    });
  }
}
