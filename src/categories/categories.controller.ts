import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/guards';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create category (admin only)' })
  async createCategory(@Body() body: { name: string; description?: string }) {
    return this.categoriesService.createCategory(body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update category (admin only)' })
  async updateCategory(@Param('id') id: string, @Body() body: { name?: string; description?: string }) {
    return this.categoriesService.updateCategory(parseInt(id), body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category (admin only)' })
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(parseInt(id));
  }
}