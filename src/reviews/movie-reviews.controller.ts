import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('api/movies/:movie_id/reviews')
export class MovieReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({
    summary: 'Kino sharhlari royxati',
    description: "Public endpoint. Tanlangan kino uchun foydalanuvchilar sharhlarini qaytaradi.",
  })
  async getMovieReviews(@Param('movie_id') movieId: string) {
    return this.reviewsService.getMovieReviews(parseInt(movieId, 10));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: "Kino uchun sharh qo'shish",
    description:
      "Faqat login bo'lgan foydalanuvchi sharh qoldiradi. Bitta user bir kinoga faqat bitta sharh yozishi mumkin.",
  })
  @ApiBody({ type: CreateReviewDto })
  async createReview(
    @Param('movie_id') movieId: string,
    @Body() body: CreateReviewDto | undefined,
    @Req() req: Request & { user: any },
  ) {
    const parsedMovieId = parseInt(movieId, 10);
    if (Number.isNaN(parsedMovieId)) {
      throw new BadRequestException('movie_id must be a valid number');
    }

    if (!body) {
      throw new BadRequestException('Request body is required');
    }

    return this.reviewsService.createReview(parsedMovieId, req.user.userId, body.rating, body.comment);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':reviewId')
  @ApiOperation({
    summary: "Kino sharhini o'chirish",
    description: "Sharh egasi yoki admin sharhni o'chira oladi.",
  })
  async deleteMovieReview(
    @Param('reviewId') reviewId: string,
    @Req() req: Request & { user: any },
  ) {
    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN';
    return this.reviewsService.deleteReview(parseInt(reviewId, 10), req.user.userId, isAdmin);
  }
}
