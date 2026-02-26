import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: "Get authenticated user's profile" })
  @ApiResponse({ status: 200, description: 'Profile data returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  async getMyProfile(@Req() req: Request & { user: { userId: number } }) {
    return this.profileService.getMyProfile(req.user.userId);
  }

  @Put()
  @ApiOperation({ summary: "Update authenticated user's profile" })
  @ApiResponse({ status: 200, description: 'Profile updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateMyProfile(
    @Req() req: Request & { user: { userId: number } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateMyProfile(req.user.userId, dto);
  }
}
