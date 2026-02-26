import { Body, Controller, Get, Req, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Profile')
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: "O'z profilini olish",
    description: "Faqat login bo'lgan foydalanuvchi o'z profil ma'lumotlarini ko'ra oladi.",
  })
  async getProfile(@Req() req: Request & { user: any }) {
    return this.usersService.getUserProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put()
  @ApiOperation({
    summary: "O'z profilini yangilash",
    description: "Foydalanuvchi faqat o'z profilini yangilashi mumkin. Boshqa user ma'lumotiga kira olmaydi.",
  })
  async updateProfile(
    @Req() req: Request & { user: any },
    @Body() body: { fullName?: string; phone?: string; country?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(req.user.userId, body);
  }
}
