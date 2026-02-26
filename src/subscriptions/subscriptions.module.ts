import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AdminSubscriptionPlansController } from './admin-subscription-plans.controller';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [SubscriptionsService, PrismaService, RolesGuard],
  controllers: [SubscriptionsController, AdminSubscriptionPlansController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
