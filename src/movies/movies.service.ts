import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MovieAccessType } from '@prisma/client';
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

    if (movie.accessType === 'PREMIUM' && !userId) {
      throw new ForbiddenException("Premium kino uchun login va aktiv obuna talab qilinadi");
    }

    if (movie.accessType === 'PREMIUM' && userId) {
      const hasPremium = await this.subscriptionsService.hasActivePremiumSubscription(userId);

      if (!hasPremium) {
        throw new ForbiddenException('Bu kino faqat Premium obunachilar uchun mavjud');
      }
    }
    return movie;
  }

  async getAllMovies(
    limit = 10,
    skip = 0,
    accessType?: string,
    search?: string,
    categorySlug?: string,
    categoryId?: number,
  ) {
    const where: any = {};
    if (accessType) where.accessType = accessType;
    if (search) {
      where.title = {
        contains: search,
      };
    }
    if (categoryId) {
      where.categories = {
        some: { categoryId },
      };
    } else if (categorySlug) {
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      };
    }

    return this.prisma.movie.findMany({
      where,
      skip,
      take: limit,
      include: { categories: true, reviews: true, files: true },
    });
  }

  async hasActivePremiumSubscription(userId: number): Promise<boolean> {
    return this.subscriptionsService.hasActivePremiumSubscription(userId);
  }

  async getMoviesForFreeEndpoint(userId?: number) {
    const hasPremiumSubscription = userId
      ? await this.subscriptionsService.hasActivePremiumSubscription(userId)
      : false;

    return this.prisma.movie.findMany({
      where: hasPremiumSubscription ? {} : { accessType: 'FREE' },
      include: { categories: true, reviews: true, files: true },
    });
  }

  async createMovie(data: any, createdById: number) {
    const releaseYear = Number.parseInt(String(data.releaseYear), 10);
    const duration = Number.parseInt(String(data.duration), 10);
    const accessTypeValue = String(data.accessType || 'FREE').toUpperCase();

    if (Number.isNaN(releaseYear)) {
      throw new BadRequestException('releaseYear must be a number');
    }

    if (Number.isNaN(duration)) {
      throw new BadRequestException('duration must be a number');
    }

    if (!['FREE', 'PREMIUM'].includes(accessTypeValue)) {
      throw new BadRequestException("accessType must be 'FREE' or 'PREMIUM'");
    }
    const accessType = accessTypeValue as MovieAccessType;

    return this.prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        releaseYear,
        duration,
        accessType,
        createdById,
      },
    });
  }

  async updateMovie(id: number, data: any) {
    const updateData: any = { ...data };

    if (data.releaseYear !== undefined) {
      const releaseYear = Number.parseInt(String(data.releaseYear), 10);
      if (Number.isNaN(releaseYear)) {
        throw new BadRequestException('releaseYear must be a number');
      }
      updateData.releaseYear = releaseYear;
    }

    if (data.duration !== undefined) {
      const duration = Number.parseInt(String(data.duration), 10);
      if (Number.isNaN(duration)) {
        throw new BadRequestException('duration must be a number');
      }
      updateData.duration = duration;
    }

    if (data.accessType !== undefined) {
      const accessTypeValue = String(data.accessType).toUpperCase();
      if (!['FREE', 'PREMIUM'].includes(accessTypeValue)) {
        throw new BadRequestException("accessType must be 'FREE' or 'PREMIUM'");
      }
      updateData.accessType = accessTypeValue as MovieAccessType;
    }

    return this.prisma.movie.update({
      where: { id },
      data: updateData,
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

  async addMovieFile(movieId: number, data: { quality: string; language?: string; filePath: string; fileSize?: number; duration?: number }) {
    return this.prisma.movieFile.create({
      data: {
        movieId,
        quality: data.quality,
        language: data.language || 'uz',
        filePath: data.filePath,
        fileSize: data.fileSize || 0,
        duration: data.duration || 0,
      },
    });
  }

  async deleteMovieFile(movieId: number, fileId: number) {
    return this.prisma.movieFile.deleteMany({
      where: { id: fileId, movieId },
    });
  }
}
