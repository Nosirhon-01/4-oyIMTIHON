import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getAllReviews() {
    return this.prisma.review.findMany({
      include: {
        user: { select: { id: true, username: true } },
        movie: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMovieReviews(movieId: number) {
    return this.prisma.review.findMany({
      where: { movieId },
      include: { user: { select: { username: true, id: true } } },
    });
  }

  async createReview(movieId: number, userId: number, rating: number, comment?: string) {
    const normalizedRating = Number.parseInt(String(rating), 10);
    if (Number.isNaN(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      throw new BadRequestException('rating must be an integer between 1 and 5');
    }

    const existingReview = await this.prisma.review.findFirst({
      where: { movieId, userId },
    });

    if (existingReview) {
      throw new BadRequestException('You already reviewed this movie');
    }

    return this.prisma.review.create({
      data: { movieId, userId, rating: normalizedRating, comment },
      include: { user: { select: { username: true } } },
    });
  }

  async updateReview(reviewId: number, userId: number, rating?: number, comment?: string, isAdmin = false) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || (review.userId !== userId && !isAdmin)) {
      throw new ForbiddenException('You can only update your own review');
    }

    if (rating === undefined && comment === undefined) {
      throw new BadRequestException('At least one of rating or comment must be provided');
    }

    let normalizedRating: number | undefined;
    if (rating !== undefined) {
      normalizedRating = Number.parseInt(String(rating), 10);
      if (Number.isNaN(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
        throw new BadRequestException('rating must be an integer between 1 and 5');
      }
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { rating: normalizedRating, comment },
    });
  }

  async deleteReview(reviewId: number, userId: number, isAdmin = false) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || (review.userId !== userId && !isAdmin)) {
      throw new ForbiddenException('You can only delete your own review');
    }

    return this.prisma.review.delete({ where: { id: reviewId } });
  }

  async adminDeleteReview(reviewId: number) {
    return this.prisma.review.delete({ where: { id: reviewId } });
  }
}



