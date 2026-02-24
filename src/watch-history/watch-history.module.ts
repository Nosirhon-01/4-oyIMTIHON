import { Module } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { WatchHistoryController } from './watch-history.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [WatchHistoryService, PrismaService],
  controllers: [WatchHistoryController],
})
export class WatchHistoryModule {}