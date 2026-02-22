import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient | null = null;

  private getPrismaInstance(): PrismaClient {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
    return this.prisma!;
  }

  async onModuleInit() {
    try {
      const client = this.getPrismaInstance();
      await client.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
  }


  get user() {
    return this.getPrismaInstance().user;
  }

  get profile() {
    return this.getPrismaInstance().profile;
  }

  get subscriptionPlan() {
    return this.getPrismaInstance().subscriptionPlan;
  }

  get userSubscription() {
    return this.getPrismaInstance().userSubscription;
  }

  get payment() {
    return this.getPrismaInstance().payment;
  }

  get category() {
    return this.getPrismaInstance().category;
  }

  get movie() {
    return this.getPrismaInstance().movie;
  }

  get movieCategory() {
    return this.getPrismaInstance().movieCategory;
  }

  get movieFile() {
    return this.getPrismaInstance().movieFile;
  }

  get review() {
    return this.getPrismaInstance().review;
  }

  get favorite() {
    return this.getPrismaInstance().favorite;
  }

  get watchHistory() {
    return this.getPrismaInstance().watchHistory;
  }

  get $transaction() {
    return this.getPrismaInstance().$transaction.bind(this.getPrismaInstance());
  }

  get $queryRaw() {
    return this.getPrismaInstance().$queryRaw.bind(this.getPrismaInstance());
  }
}
