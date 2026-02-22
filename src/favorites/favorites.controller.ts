import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('api/favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get user favorite movies' })
  async getFavorites(@Request() req: any) {
    return this.favoritesService.getUserFavorites(req.user.userId);
  }

  
  @UseGuards(JwtAuthGuard)
  @Post(':movieId')
  @ApiOperation({ summary: 'Add movie to favorites' })
  async addFavorite(@Param('movieId') movieId: string, @Request() req: any) {
    return this.favoritesService.addFavorite(req.user.userId, parseInt(movieId));
  }

  
  @UseGuards(JwtAuthGuard)
  @Delete(':movieId')
  @ApiOperation({ summary: 'Remove movie from favorites' })
  async removeFavorite(@Param('movieId') movieId: string, @Request() req: any) {
    return this.favoritesService.removeFavorite(req.user.userId, parseInt(movieId));
  }


  @UseGuards(JwtAuthGuard)
  @Get('check/:movieId')
  @ApiOperation({ summary: 'Check if movie is favorited' })
  async isFavorite(@Param('movieId') movieId: string, @Request() req: any) {
    const isFav = await this.favoritesService.isFavorite(req.user.userId, parseInt(movieId));
    return { isFavorite: isFav };
  }
}
