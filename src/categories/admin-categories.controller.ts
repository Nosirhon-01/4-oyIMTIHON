import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../roles.decorator';
import { CategoriesService } from './categories.service';

@ApiTags('Categories (Admin)')
@Controller('api/admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Post()
  @ApiOperation({
    summary: 'Kategoriya yaratish',
    description: "Faqat ADMIN yoki SUPERADMIN yangi kategoriya qo'shishi mumkin.",
  })
  async createCategory(@Body() body: { name: string }) {
    return this.categoriesService.createCategory(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Put(':id')
  @ApiOperation({
    summary: 'Kategoriyani yangilash',
    description: "Faqat ADMIN yoki SUPERADMIN kategoriya ma'lumotlarini yangilaydi.",
  })
  async updateCategory(@Param('id') id: string, @Body() body: { name?: string }) {
    return this.categoriesService.updateCategory(parseInt(id, 10), body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: "Kategoriya ochirish",
    description:
      "Kategoriya ochirish. Faqat ADMIN yoki SUPERADMIN ruxsatiga ega foydalanuvchilar foydalanishi mumkin.",
  })
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(parseInt(id, 10));
  }
}
