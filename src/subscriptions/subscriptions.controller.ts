import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('api/subscription')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({
    summary: 'Obuna rejalari',
    description: "Public endpoint. Mavjud obuna planlarini ro'yxat shaklida qaytaradi.",
  })
  @ApiResponse({ status: 200, description: "Obuna planlari ro'yxati." })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({
    summary: "Mening obunam",
    description: "Faqat login bo'lgan foydalanuvchi o'z joriy obunasini ko'ra oladi.",
  })
  async getMySubscription(@Req() req: Request & { user: any }) {
    return this.subscriptionsService.getCurrentSubscription(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('purchase')
  @ApiOperation({
    summary: "Obuna sotib olish",
    description: "Foydalanuvchi o'zi uchun obuna sotib oladi va to'lov yozuvi yaratiladi.",
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['plan_id', 'card_number'],
      properties: {
        plan_id: { type: 'number', example: 1 },
        card_number: { type: 'string', example: '4242424242424242' },
        cvv: { type: 'string', example: '123' },
      },
    },
  })
  async purchaseSubscription(
    @Body() body: { plan_id?: number; card_number?: string; planId?: number; cardNumber?: string; cvv?: string },
    @Req() req: Request & { user: any },
  ) {
    const planId = body.plan_id ?? body.planId;
    const cardNumber = body.card_number ?? body.cardNumber;

    if (!planId || !cardNumber) {
      throw new BadRequestException('plan_id va card_number majburiy');
    }

    return this.subscriptionsService.purchaseSubscription(req.user.userId, planId, cardNumber);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('cancel')
  @ApiOperation({
    summary: "Obunani bekor qilish",
    description: "Foydalanuvchi o'zining joriy obunasini bekor qiladi.",
  })
  async cancelSubscription(@Req() req: Request & { user: any }) {
    return this.subscriptionsService.cancelCurrentSubscription(req.user.userId);
  }
}
