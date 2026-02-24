import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class MoviesService {
  constructor(
    private prisma: PrismaService,
    private subscriptionsService: SubscriptionsService,
  ) {}



  async getMovieById(id: number, userId?: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        categories: true,
        reviews: { include: { user: { select: { id: true, username: true } } } }, 
        files: true,
      },
    });

    if (!movie) {
      throw new NotFoundException('Kino topilmadi');
    }

   
    if (movie.accessType === 'PREMIUM' && userId !== undefined) {
      const hasPremium = await this.subscriptionsService.hasActivePremiumSubscription(userId);

      if (!hasPremium) {
        throw new ForbiddenException('Bu kino faqat Premium obunachilar uchun mavjud');
      }
    }

    

    return movie;
  }

  

async getAllMovies(limit = 10, skip = 0, accessType?: string, categoryId?: number) {
    const where: any = {};
    if (accessType) where.accessType = accessType;
    if (categoryId) {
      where.categories = {
        some: { categoryId },
      };
    }

    return this.prisma.movie.findMany({
      where,
      skip,
      take: limit,
      include: { categories: true, reviews: true, files: true },
    });
  }

 async createMovie(
    data: {
      title: string;
      description: string;
      releaseYear: number;
      duration: number;
      accessType?: 'FREE' | 'PREMIUM';
    },
    createdById: number,
  ) {
    return this.prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        releaseYear: data.releaseYear,
        duration: data.duration,
        accessType: (data.accessType as any) || 'FREE',
        createdById,
      },
    });
  }


  async updateMovie(id: number, data: any) {
    return this.prisma.movie.update({
      where: { id },
      data,
      include: { categories: true },
    });
  }


  async deleteMovie(id: number) {
    return this.prisma.movie.delete({
      where: { id },
    });
  }


  async searchMovies(query: string, limit = 10) {
    return this.prisma.movie.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: limit,
    });
  }

 
  async addMovieToCategory(movieId: number, categoryId: number) {
    return this.prisma.movieCategory.create({
      data: { movieId, categoryId },
    });
  }

  
  async getMovieFiles(movieId: number) {
    return this.prisma.movieFile.findMany({
      where: { movieId },
    });
  }
}















