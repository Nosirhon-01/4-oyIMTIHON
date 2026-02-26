import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../roles.decorator';
import { MoviesService } from './movies.service';

@ApiTags('Movies (Admin)')
@Controller('api/admin/movies')
export class AdminMoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Get()
  @ApiOperation({
    summary: 'Admin kinolar royxati',
    description: "Faqat ADMIN yoki SUPERADMIN kino boshqaruvi uchun to'liq ro'yxatni ko'ra oladi.",
  })
  async getAdminMovies() {
    return this.moviesService.getAllMovies(100, 0);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('poster'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'releaseYear', 'duration'],
      properties: {
        title: { type: 'string', example: 'Yangi Film' },
        description: { type: 'string', example: 'Film tavsifi' },
        releaseYear: { type: 'number', example: 2025 },
        duration: { type: 'number', example: 120 },
        accessType: { type: 'string', enum: ['FREE', 'PREMIUM'], example: 'FREE' },
        poster: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({
    summary: 'Yangi kino yaratish',
    description: 'Faqat ADMIN yoki SUPERADMIN yangi kino yaratishi mumkin.',
  })
  async createMovie(
    @Body()
    body: {
      title: string;
      description: string;
      releaseYear: number;
      duration: number;
      accessType?: 'FREE' | 'PREMIUM';
    },
    @UploadedFile() poster: Express.Multer.File,
    @Req() req: Request & { user: any },
  ) {
    return this.moviesService.createMovie(
      {
        ...body,
        posterUrl: poster?.path,
      },
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Put(':movie_id')
  @ApiOperation({
    summary: "Kinoni yangilash",
    description: "Faqat ADMIN yoki SUPERADMIN kino ma'lumotlarini yangilashi mumkin.",
  })
  async updateMovie(@Param('movie_id') movieId: string, @Body() body: any) {
    return this.moviesService.updateMovie(parseInt(movieId, 10), body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Delete(':movie_id')
  @ApiOperation({
    summary: "Kinoni o'chirish",
    description: "Faqat ADMIN yoki SUPERADMIN kinoni tizimdan o'chira oladi.",
  })
  async deleteMovie(@Param('movie_id') movieId: string) {
    return this.moviesService.deleteMovie(parseInt(movieId, 10));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Post(':movie_id/files')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['quality', 'file'],
      properties: {
        quality: { type: 'string', example: '720p' },
        language: { type: 'string', example: 'uz' },
        duration: { type: 'number', example: 120 },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({
    summary: 'Kino faylini yuklash',
    description: "Faqat ADMIN yoki SUPERADMIN kino faylini yuklab filmga biriktirishi mumkin.",
  })
  async uploadMovieFile(
    @Param('movie_id') movieId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { quality: string; language?: string; duration?: number },
  ) {
    return this.moviesService.addMovieFile(parseInt(movieId, 10), {
      quality: body.quality,
      language: body.language,
      duration: body.duration ? parseInt(String(body.duration), 10) : undefined,
      filePath: file?.path || '',
      fileSize: file?.size,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'SUPERADMIN')
  @Delete(':movie_id/files/:file_id')
  @ApiOperation({
    summary: "Kino faylini o'chirish",
    description: "Faqat ADMIN yoki SUPERADMIN filmga biriktirilgan faylni o'chira oladi.",
  })
  async deleteMovieFile(@Param('movie_id') movieId: string, @Param('file_id') fileId: string) {
    return this.moviesService.deleteMovieFile(parseInt(movieId, 10), parseInt(fileId, 10));
  }
}
