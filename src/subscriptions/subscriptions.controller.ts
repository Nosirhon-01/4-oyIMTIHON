import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuperadminGuard } from '../auth/guards';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('api/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}


  @Get('plans')
  @ApiOperation({ summary: 'Barcha mavjud obuna rejalarni olish' })
  @ApiResponse({ status: 200, description: 'Obuna rejalar royxati' })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }


  @UseGuards(JwtAuthGuard)
  @Get('my-subscriptions')
  @ApiOperation({ summary: 'Joriy foydalanuvchining obunalari' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi obunalari' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
  async getUserSubscriptions(@Request() req: any) {
    return this.subscriptionsService.getUserSubscription(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  @ApiOperation({
    summary: 'Obuna sotib olish (mock tolov tizimi)',
    description:
      'Karta raqami 16 ta raqamdan iborat bolsa tolov muvaffaqiyatli hisoblanadi. Real loyihada Stripe yoki boshqa tolov tizimi bilan almashtiriladi.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['planId', 'cardNumber'],
      properties: {
        planId: { type: 'number', example: 1 },
        cardNumber: { type: 'string', example: '4242424242424242' },
        cvv: { type: 'string', example: '123', description: 'Ixtiyoriy, hozircha ishlatilmaydi' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Obuna muvaffaqiyatli sotib olindi (mock)' })
  @ApiResponse({ status: 400, description: 'Notogri karta raqami yoki plan topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
  async purchaseSubscription(
    @Body() body: { planId: number; cardNumber: string; cvv?: string },
    @Request() req: any,
  ) {
    const { planId, cardNumber } = body;

    if (!planId || !cardNumber) {
      throw new BadRequestException('planId va cardNumber majburiy maydonlar');
    }

  
    const cleanedCard = cardNumber.replace(/\D/g, '');
    if (cleanedCard.length !== 16) {
      throw new BadRequestException('Karta raqami notogri. 16 ta raqam kiritilishi kerak.');
    }



    return this.subscriptionsService.purchaseSubscription(
      req.user.userId,
      planId,
      cardNumber, 
    );
  }


  @UseGuards(JwtAuthGuard)
  @Delete('cancel/:subscriptionId')
  @ApiOperation({ summary: 'Obunani bekor qilish' })
  @ApiResponse({ status: 200, description: 'Obuna bekor qilindi' })
  @ApiResponse({ status: 403, description: 'Faqat oz obunangizni bekor qila olasiz' })
  @ApiResponse({ status: 404, description: 'Obuna topilmadi' })
  async cancelSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Request() req: any,
  ) {
    const id = parseInt(subscriptionId, 10);

    if (isNaN(id)) {
      throw new BadRequestException('subscriptionId notogri formatda');
    }

    return this.subscriptionsService.cancelSubscription(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Post('plans')
  @ApiOperation({ summary: 'Yangi obuna rejasini yaratish (faqat superadmin)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'price', 'duration', 'features'],
      properties: {
        name: { type: 'string', example: 'Premium Plus' },
        price: { type: 'number', example: 79.99 },
        duration: { type: 'number', example: 90, description: 'kunlarda' },
        features: { type: 'string', example: '4K, Reklamasiz, 5 qurilma' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Yangi reja yaratildi' })
  @ApiResponse({ status: 403, description: 'Faqat superadmin uchun' })
  async createPlan(
    @Body() body: { name: string; price: number; duration: number; features: string },
  ) {
    return this.subscriptionsService.createPlan(body);
  }
}