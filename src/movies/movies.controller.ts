import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@Controller('api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({
    summary: 'Kinolar royxati',
    description: 'Public endpoint. Kinolarni pagination va filterlar bilan olish imkonini beradi.',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'subscription_type', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'accessType', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async getAllMovies(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('skip') skip = '0',
    @Query('search') search?: string,
    @Query('subscription_type') subscriptionType?: string,
    @Query('category') categorySlug?: string,
    @Query('accessType') accessType?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const parsedSkip = parseInt(skip, 10);
    const finalSkip = Number.isNaN(parsedSkip) ? (parsedPage - 1) * parsedLimit : parsedSkip;
    const finalAccessType = (subscriptionType || accessType)?.toUpperCase();

    return this.moviesService.getAllMovies(
      parsedLimit,
      finalSkip,
      finalAccessType,
      search,
      categorySlug,
      categoryId ? parseInt(categoryId, 10) : undefined,
    );
  }

  @Get('search/:query')
  @ApiOperation({
    summary: "Kino qidirish",
    description: "Public endpoint. Kino nomi bo'yicha qidiruv natijalarini qaytaradi.",
  })
  async searchMovies(@Param('query') query: string) {
    return this.moviesService.searchMovies(query);
  }

  @Get('free')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Bepul kinolar royxati',
    description:
      "Agar foydalanuvchida aktiv Premium obuna bo'lsa FREE va PREMIUM kinolarni, aks holda faqat FREE kinolarni qaytaradi.",
  })
  async getFreeMovies(@Req() req: Request & { user?: { userId: number } }) {
    return this.moviesService.getMoviesForFreeEndpoint(req.user?.userId);
  }

  @Get(':movie_id/files')
  @ApiOperation({
    summary: 'Kino fayllari',
    description:
      "Kino fayllarini qaytaradi. Premium kino bo'lsa, faqat aktiv obunali foydalanuvchi kira oladi.",
  })
  async getMovieFiles(@Param('movie_id') movieId: string, @Req() req: Request & { user?: any }) {
    await this.moviesService.getMovieById(parseInt(movieId, 10), req.user?.userId);
    return this.moviesService.getMovieFiles(parseInt(movieId, 10));
  }

  @Get(':movie_id')
  @ApiOperation({
    summary: "Bitta kino tafsiloti",
    description: "Kino tafsilotlarini qaytaradi. Premium kino uchun faqat aktiv obunali userga ruxsat beriladi.",
  })
  async getMovieById(@Param('movie_id') movieId: string, @Req() req: Request & { user?: any }) {
    return this.moviesService.getMovieById(parseInt(movieId, 10), req.user?.userId);
  }
}
