import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Kategoriyalar royxati',
    description: "Public endpoint. Barcha kategoriyalar ro'yxatini qaytaradi.",
  })
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Slug boyicha kategoriya',
    description: "Public endpoint. Berilgan slug bo'yicha kategoriya ma'lumotini qaytaradi.",
  })
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getCategoryBySlug(slug);
  }
}
