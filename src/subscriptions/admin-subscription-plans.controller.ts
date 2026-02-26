import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../roles.decorator';
import { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from './dto/admin-subscription-plan.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions (Admin Plans)')
@Controller('api/admin/subscription-plans')
export class AdminSubscriptionPlansController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Get()
  @ApiOperation({
    summary: "Planlar ro'yxati (admin panel)",
    description: "Faqat SUPERADMIN obuna planlari boshqaruv ro'yxatini ko'ra oladi.",
  })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Post()
  @ApiOperation({
    summary: 'Plan yaratish',
    description: "Faqat SUPERADMIN yangi obuna planini yaratadi.",
  })
  async createPlan(@Body() body: CreateSubscriptionPlanDto) {
    return this.subscriptionsService.createPlan(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Put(':id')
  @ApiOperation({
    summary: 'Planni yangilash',
    description: "Faqat SUPERADMIN obuna plani ma'lumotlarini yangilaydi.",
  })
  async updatePlan(@Param('id') id: string, @Body() body: UpdateSubscriptionPlanDto) {
    return this.subscriptionsService.updatePlan(parseInt(id, 10), body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPERADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: "Planni o'chirish",
    description: "Faqat SUPERADMIN obuna planini o'chira oladi.",
  })
  async deletePlan(@Param('id') id: string) {
    return this.subscriptionsService.deletePlan(parseInt(id, 10));
  }
}
