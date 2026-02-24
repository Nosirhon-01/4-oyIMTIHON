import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}


  async getAllCategories() {
    return this.prisma.category.findMany();
  }


  async createCategory(data: { name: string }) {
    const slug = this.generateSlug(data.name);

    return this.prisma.category.create({
      data: {
        name: data.name,
        slug,
      },
    });
  }


  async updateCategory(id: number, data: { name?: string }) {
    const updateData: { name?: string; slug?: string } = {};

    if (data.name) {
      updateData.name = data.name;
      updateData.slug = this.generateSlug(data.name);
    }

    return this.prisma.category.update({
      where: { id },
      data: updateData,
    });
  }


  async deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

 
  private generateSlug(name: string): string {
  return name.toLowerCase().replaceAll(' ', '-');
}
}