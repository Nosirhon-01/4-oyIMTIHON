import { Body, Controller, Delete, Get, Param, Put, Request, UseGuards } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Watch History')
@Controller('api/watch-history')
export class WatchHistoryController {
  constructor(private watchHistoryService: WatchHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: "Ko'rish tarixi",
    description: "Faqat login bo'lgan foydalanuvchi o'z ko'rish tarixini ko'ra oladi.",
  })
  async getWatchHistory(@Request() req: any) {
    return this.watchHistoryService.getUserWatchHistory(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':movieId')
  @ApiOperation({
    summary: "Ko'rish progressini yangilash",
    description: "Foydalanuvchi faqat o'zi ko'rgan kino progressini yangilaydi.",
  })
  async updateWatchHistory(
    @Param('movieId') movieId: string,
    @Body() body: { watchedDuration: number; watchedPercentage: number },
    @Request() req: any,
  ) {
    return this.watchHistoryService.updateWatchHistory(
      req.user.userId,
      parseInt(movieId, 10),
      body.watchedDuration,
      body.watchedPercentage,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':movieId')
  @ApiOperation({
    summary: "Bitta tarix yozuvini o'chirish",
    description: "Foydalanuvchi faqat o'zining tanlangan kino bo'yicha tarix yozuvini o'chira oladi.",
  })
  async deleteWatchHistoryItem(@Param('movieId') movieId: string, @Request() req: any) {
    return this.watchHistoryService.deleteWatchHistoryItem(req.user.userId, parseInt(movieId, 10));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  @ApiOperation({
    summary: "Ko'rish tarixini tozalash",
    description: "Foydalanuvchi faqat o'zining barcha ko'rish tarixini tozalay oladi.",
  })
  async clearWatchHistory(@Request() req: any) {
    return this.watchHistoryService.clearWatchHistory(req.user.userId);
  }
}
