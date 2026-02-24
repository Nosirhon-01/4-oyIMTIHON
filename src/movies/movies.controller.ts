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
  UseInterceptors,
  UploadedFile,
  UploadedFiles
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/guards';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'; 

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
  @Query('categoryId') categoryId?: string,
) {
  return this.moviesService.getAllMovies(
    parseInt(limit),
    parseInt(skip),
    accessType,
    categoryId ? parseInt(categoryId) : undefined,    
  );
}


  @Get(':id')
  @ApiOperation({ summary: 'Get movie details' })
  async getMovieById(@Param('id') id: string, @Request() req: any) {
  const userId = req.user?.userId
  return this.moviesService.getMovieById(parseInt(id), userId);
}

  
  @Get('search/:query')
  @ApiOperation({ summary: 'Search movies by title' })
  async searchMovies(@Param('query') query: string) {
    return this.moviesService.searchMovies(query);
  }


  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('poster'))
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
    @UploadedFile() poster: Express.Multer.File,
    @Request() req: any,
  ) {
    const data = { ...body, posterUrl: poster ? poster.path : undefined };
    return this.moviesService.createMovie(body, req.user.userId);
  }

 
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/files')
  @UseInterceptors(FileInterceptor('file'))
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
