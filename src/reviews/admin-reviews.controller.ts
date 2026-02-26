import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../roles.decorator';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews (Admin)')
@Controller('api/admin/reviews')
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Get()
  @ApiOperation({
    summary: "Sharhlar moderatsiya ro'yxati",
    description: "Faqat ADMIN yoki SUPERADMIN barcha sharhlarni moderatsiya uchun ko'ra oladi.",
  })
  async getAllReviews() {
    return this.reviewsService.getAllReviews();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: "Sharhni moderatsiya orqali o'chirish",
    description: "Faqat ADMIN yoki SUPERADMIN istalgan sharhni moderatsiya sababli o'chirishi mumkin.",
  })
  async adminDeleteReview(@Param('id') id: string) {
    return this.reviewsService.adminDeleteReview(parseInt(id, 10));
  }
}
