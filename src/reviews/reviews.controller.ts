import { BadRequestException, Body, Controller, Delete, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({
    summary: 'Sharhni yangilash',
    description: "Sharhni yangilash (faqat sharh egasi yoki admin ruxsatiga ega foydalanuvchilar uchun).",
  })
  @ApiBody({ type: UpdateReviewDto })
  async updateReview(
    @Param('id') id: string,
    @Body() body: UpdateReviewDto | undefined,
    @Req() req: Request & { user: any },
  ) {
    if (!body) {
      throw new BadRequestException('Request body is required');
    }

    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN';
    return this.reviewsService.updateReview(parseInt(id, 10), req.user.userId, body.rating, body.comment, isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: "Sharhni o'chirish",
    description: "Sharhni o'chirish (faqat sharh egasi yoki admin ruxsatiga ega foydalanuvchilar uchun).",
  })
  async deleteReview(@Param('id') id: string, @Req() req: Request & { user: any }) {
    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN';
    return this.reviewsService.deleteReview(parseInt(id, 10), req.user.userId, isAdmin);
  }
}
