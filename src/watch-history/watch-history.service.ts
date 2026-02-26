import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WatchHistoryService {
  constructor(private prisma: PrismaService) {}

  async getUserWatchHistory(userId: number) {
    return this.prisma.watchHistory.findMany({
      where: { userId },
      include: { movie: true },
    });
  }

  async updateWatchHistory(userId: number, movieId: number, watchedDuration: number, watchedPercentage: number) {
    return this.prisma.watchHistory.upsert({
      where: { userId_movieId: { userId, movieId } },
      update: { watchedDuration, watchedPercentage, lastWatchedAt: new Date() },
      create: { userId, movieId, watchedDuration, watchedPercentage },
    });
  }

  async deleteWatchHistoryItem(userId: number, movieId: number) {
    return this.prisma.watchHistory.deleteMany({
      where: { userId, movieId },
    });
  }

  async clearWatchHistory(userId: number) {
    return this.prisma.watchHistory.deleteMany({
      where: { userId },
    });
  }
}
