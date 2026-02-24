import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Watch History')
@Controller('api/watch-history')
export class WatchHistoryController {
  constructor(private watchHistoryService: WatchHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get user watch history' })
  async getWatchHistory(@Request() req: any) {
    return this.watchHistoryService.getUserWatchHistory(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Update watch history' })
  async updateWatchHistory(
    @Body() body: { movieId: number; watchedDuration: number; watchedPercentage: number },
    @Request() req: any,
  ) {
    return this.watchHistoryService.updateWatchHistory(
      req.user.userId,
      body.movieId,
      body.watchedDuration,
      body.watchedPercentage,
    );
  }
}