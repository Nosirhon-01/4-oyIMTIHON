import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [MoviesService, PrismaService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
