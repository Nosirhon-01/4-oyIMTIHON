import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getMovieReviews(movieId: number) {
    return this.prisma.review.findMany({
      where: { movieId },
      include: { user: { select: { username: true, id: true } } },
    });
  }

  async createReview(movieId: number, userId: number, rating: number, comment?: string) {
    const existingReview = await this.prisma.review.findFirst({
      where: { movieId, userId },
    });

    if (existingReview) {
      throw new BadRequestException('You already reviewed this movie');
    }

    return this.prisma.review.create({
      data: { movieId, userId, rating, comment },
      include: { user: { select: { username: true } } },
    });
  }

  async updateReview(reviewId: number, userId: number, rating: number, comment?: string, isAdmin = false) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || (review.userId !== userId && !isAdmin)) {
      throw new ForbiddenException('You can only update your own review');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
    });
  }

  async deleteReview(reviewId: number, userId: number, isAdmin = false) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || (review.userId !== userId && !isAdmin)) {
      throw new ForbiddenException('You can only delete your own review');
    }

    return this.prisma.review.delete({ where: { id: reviewId } });
  }
}