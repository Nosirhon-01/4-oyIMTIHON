import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/guards';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('api/movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  
  @Get()
  @ApiOperation({ summary: 'Get all movies with filters' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'accessType', required: false })
  async getAllMovies(
    @Query('limit') limit = '10',
    @Query('skip') skip = '0',
    @Query('accessType') accessType?: string,
  ) {
    return this.moviesService.getAllMovies(
      parseInt(limit),
      parseInt(skip),
      accessType,
    );
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get movie details' })
  async getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(parseInt(id));
  }

  
  @Get('search/:query')
  @ApiOperation({ summary: 'Search movies by title' })
  async searchMovies(@Param('query') query: string) {
    return this.moviesService.searchMovies(query);
  }


  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create new movie (admin only)' })
  async createMovie(
    @Body()
    body: {
      title: string;
      description: string;
      releaseYear: number;
      duration: number;
      accessType?: 'FREE' | 'PREMIUM';
    },
    @Request() req: any,
  ) {
    return this.moviesService.createMovie(body, req.user.userId);
  }

 
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update movie (admin only)' })
  async updateMovie(@Param('id') id: string, @Body() body: any) {
    return this.moviesService.updateMovie(parseInt(id), body);
  }


  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete movie (admin only)' })
  async deleteMovie(@Param('id') id: string) {
    return this.moviesService.deleteMovie(parseInt(id));
  }
}
