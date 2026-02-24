import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Module({
  providers: [MoviesService, PrismaService,SubscriptionsService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
