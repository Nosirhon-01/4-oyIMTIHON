import { Injectable, ForbiddenException } from '@nestjs/common';
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

 
  async purchaseSubscription(userId: number, planId: number) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

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

    return { subscription, message: 'Payment completed and subscription activated' };
  }

 
  async cancelSubscription(userId: number, subscriptionId: number) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || subscription.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own subscription');
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
