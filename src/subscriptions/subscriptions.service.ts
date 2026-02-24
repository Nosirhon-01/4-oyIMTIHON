import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany();
  }

  async getUserSubscription(userId: number) {
    return this.prisma.userSubscription.findMany({
      where: { userId },
      include: { plan: true },
    });
  }

  async hasActivePremiumSubscription(userId: number): Promise<boolean> {
    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        plan: { name: 'Premium' },
        endDate: { gt: new Date() },
      },
    });

    return !!subscription;
  }

  /**
   * Mocked payment: faqat karta raqami 16 ta raqamdan iborat bo'lsa muvaffaqiyatli hisoblanadi
   * Real hayotda Stripe yoki boshqa payment gateway bilan almashtiriladi
   */
  async purchaseSubscription(userId: number, planId: number, cardNumber: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new BadRequestException('Obuna rejasi topilmadi');
    }

   
    const cleanedCard = cardNumber.replace(/\D/g, '');

  
    if (cleanedCard.length !== 16) {
      throw new BadRequestException('Karta raqami noto\'g\'ri. 16 ta raqam kiritilishi kerak.');
    }

    
    console.log(`Mock payment success for user ${userId}, plan ${planId}, card: **** **** **** ${cleanedCard.slice(-4)}`);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await this.prisma.userSubscription.create({
      data: {
        userId,
        planId,
        endDate,
        status: 'ACTIVE',
      },
      include: { plan: true },
    });

    await this.prisma.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        amount: plan.price,
        status: 'COMPLETED',
        method: 'card',          
      },
    });

    return {
      subscription,
      message: 'To\'lov muvaffaqiyatli amalga oshirildi (mock mode)',
      last4: cleanedCard.slice(-4),
    };
  }

  async cancelSubscription(userId: number, subscriptionId: number) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || subscription.userId !== userId) {
      throw new ForbiddenException('Faqat o\'zingizning obunangizni bekor qila olasiz');
    }

    return this.prisma.userSubscription.update({
      where: { id: subscriptionId },
      data: { status: 'CANCELLED' },
    });
  }

  async createPlan(data: { name: string; price: number; duration: number; features: string }) {
    return this.prisma.subscriptionPlan.create({
      data,
    });
  }
}