import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@ApiTags('Favorites')
@Controller('api/favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: "Sevimlilar ro'yxati",
    description: "Faqat login bo'lgan foydalanuvchi o'z sevimli kinolar ro'yxatini ko'ra oladi.",
  })
  async getFavorites(@Request() req: any) {
    return this.favoritesService.getUserFavorites(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: "Sevimlilarga qo'shish",
    description: "Foydalanuvchi kinoni faqat o'z sevimlilar ro'yxatiga qo'shadi.",
  })
  @ApiBody({ type: AddFavoriteDto })
  async addFavorite(@Body() body: AddFavoriteDto | undefined, @Request() req: any) {
    if (!body) {
      throw new BadRequestException('Request body is required');
    }

    const movieId = body.movie_id ?? body.movieId;
    return this.favoritesService.addFavorite(req.user.userId, Number(movieId));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':movieId')
  @ApiOperation({
    summary: "Sevimlilardan o'chirish",
    description: "Foydalanuvchi kinoni faqat o'z sevimlilar ro'yxatidan o'chira oladi.",
  })
  async removeFavorite(@Param('movieId') movieId: string, @Request() req: any) {
    return this.favoritesService.removeFavorite(req.user.userId, parseInt(movieId));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('check/:movieId')
  @ApiOperation({
    summary: 'Sevimli holatini tekshirish',
    description: "Kino joriy foydalanuvchining sevimlilarida bor yoki yo'qligini tekshiradi.",
  })
  async isFavorite(@Param('movieId') movieId: string, @Request() req: any) {
    const isFav = await this.favoritesService.isFavorite(req.user.userId, parseInt(movieId));
    return { isFavorite: isFav };
  }
}
