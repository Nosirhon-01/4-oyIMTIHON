import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../roles.decorator';
import { ProfileService } from './profile.service';

@ApiTags('Profiles (Admin)')
@Controller('api/admin/profiles')
export class AdminProfilesController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Get()
  @ApiOperation({
    summary: "Barcha profillar ro'yxati",
    description: "Faqat SUPERADMIN tizimdagi barcha profile ma'lumotlarini ko'ra oladi.",
  })
  async getAllProfiles() {
    return this.profileService.getAllProfiles();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Get(':userId')
  @ApiOperation({
    summary: "Foydalanuvchi profile ma'lumoti",
    description: "Faqat SUPERADMIN berilgan userId bo'yicha profile ma'lumotini oladi.",
  })
  async getProfileByUserId(@Param('userId') userId: string) {
    return this.profileService.getProfileByUserId(parseInt(userId, 10));
  }
}
