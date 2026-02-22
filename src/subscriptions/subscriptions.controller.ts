import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuperadminGuard } from '../auth/guards';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('api/subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

 
  @Get('plans')
  @ApiOperation({ summary: 'Get all subscription plans' })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  
  @UseGuards(JwtAuthGuard)
  @Get('my-subscriptions')
  @ApiOperation({ summary: 'Get user subscriptions' })
  async getUserSubscriptions(@Request() req: any) {
    return this.subscriptionsService.getUserSubscription(req.user.userId);
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  @ApiOperation({ summary: 'Purchase subscription (payment is mocked)' })
  async purchaseSubscription(
    @Body() body: { planId: number; cardNumber?: string; cvv?: string },
    @Request() req: any,
  ) {
  
    return this.subscriptionsService.purchaseSubscription(req.user.userId, body.planId);
  }


  @UseGuards(JwtAuthGuard)
  @Delete('cancel/:subscriptionId')
  @ApiOperation({ summary: 'Cancel subscription' })
  async cancelSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Request() req: any,
  ) {
    return this.subscriptionsService.cancelSubscription(
      req.user.userId,
      parseInt(subscriptionId),
    );
  }


  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Post('plans')
  @ApiOperation({ summary: 'Create subscription plan (superadmin only)' })
  async createPlan(
    @Body() body: { name: string; price: number; duration: number; features: string },
  ) {
    return this.subscriptionsService.createPlan(body);
  }
}
