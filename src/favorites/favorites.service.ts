import { Injectable, ForbiddenException } from '@nestjs/common';
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
    const exists = await this.prisma.favorite.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });

    if (exists) {
      throw new Error('Movie already in favorites');
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
      throw new Error('Movie not in favorites');
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
