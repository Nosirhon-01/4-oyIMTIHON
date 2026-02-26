import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}


  async getUserFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { movie: true },
    });
  }

 
  async addFavorite(userId: number, movieId: number) {
    if (!Number.isInteger(movieId) || movieId <= 0) {
      throw new BadRequestException('movie_id noto\'g\'ri');
    }

    const exists = await this.prisma.favorite.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });

    if (exists) {
      throw new BadRequestException("Kino allaqachon sevimlilarga qo'shilgan");
    }

    return this.prisma.favorite.create({
      data: { userId, movieId },
    });
  }


  async removeFavorite(userId: number, movieId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });

    if (!favorite) {
      throw new NotFoundException("Kino sevimlilar ro'yxatida topilmadi");
    }

    return this.prisma.favorite.delete({
      where: { userId_movieId: { userId, movieId } },
    });
  }

 
  async isFavorite(userId: number, movieId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });

    return !!favorite;
  }
}
