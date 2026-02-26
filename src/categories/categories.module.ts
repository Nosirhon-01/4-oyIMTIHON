import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AdminCategoriesController } from './admin-categories.controller';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  providers: [CategoriesService, PrismaService, RolesGuard],
  controllers: [CategoriesController, AdminCategoriesController],
})
export class CategoriesModule {}
