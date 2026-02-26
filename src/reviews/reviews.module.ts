import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MovieReviewsController } from './movie-reviews.controller';
import { AdminReviewsController } from './admin-reviews.controller';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  providers: [ReviewsService, PrismaService, RolesGuard],
  controllers: [ReviewsController, MovieReviewsController, AdminReviewsController],
})
export class ReviewsModule {}
