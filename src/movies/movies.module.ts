import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { AdminMoviesController } from './admin-movies.controller';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  providers: [MoviesService, PrismaService, SubscriptionsService, RolesGuard],
  controllers: [MoviesController, AdminMoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
