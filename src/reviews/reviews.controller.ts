import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

 
  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get reviews for a movie' })
  async getMovieReviews(@Param('movieId') movieId: string) {
    return this.reviewsService.getMovieReviews(parseInt(movieId));
  }


  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create review' })
  async createReview(
    @Body() body: { movieId: number; rating: number; comment?: string },
    @Request() req: any,
  ) {
    return this.reviewsService.createReview(
      body.movieId,
      req.user.userId,
      body.rating,
      body.comment,
    );
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update review' })
  async updateReview(
    @Param('id') id: string,
    @Body() body: { rating: number; comment?: string },
    @Request() req: any,
  ) {
    return this.reviewsService.updateReview(
      parseInt(id),
      req.user.userId,
      body.rating,
      body.comment,
    );
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete review' })
  async deleteReview(@Param('id') id: string, @Request() req: any) {
    return this.reviewsService.deleteReview(
      parseInt(id),
      req.user.userId,
      req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN',
    );
  }
}
