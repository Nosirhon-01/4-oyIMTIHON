import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../roles.decorator';
import { UsersService } from './users.service';

@ApiTags('Users (Admin)')
@Controller('api/admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Get()
  @ApiOperation({
    summary: "Barcha foydalanuvchilar ro'yxati",
    description: "Faqat SUPERADMIN tizimdagi barcha foydalanuvchilar va ularning profilini ko'ra oladi.",
  })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Get(':id')
  @ApiOperation({
    summary: "Bitta foydalanuvchi ma'lumotlari",
    description: "Faqat SUPERADMIN berilgan ID bo'yicha foydalanuvchi va profil ma'lumotlarini oladi.",
  })
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Patch(':id/role')
  @ApiOperation({
    summary: "Foydalanuvchi rolini o'zgartirish",
    description: 'Faqat SUPERADMIN USER, ADMIN yoki SUPERADMIN rollarini biriktira oladi.',
  })
  async updateUserRole(@Param('id') id: string, @Body() body: { role: 'USER' | 'ADMIN' | 'SUPERADMIN' }) {
    return this.usersService.updateUserRole(parseInt(id, 10), body.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: "Foydalanuvchini o'chirish",
    description: "Faqat SUPERADMIN foydalanuvchini tizimdan o'chira oladi.",
  })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(parseInt(id, 10));
  }
}
