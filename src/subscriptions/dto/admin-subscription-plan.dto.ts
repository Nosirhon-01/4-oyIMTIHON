import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateSubscriptionPlanDto {
  @ApiProperty({ example: 'Premium' })
  name: string;

  @ApiProperty({ example: 99.99 })
  price: number;

  @ApiProperty({ example: 30, description: 'Plan duration in days' })
  duration: number;

  @ApiProperty({ example: 'HD streaming, 4 devices, no ads' })
  features: string;
}

export class UpdateSubscriptionPlanDto extends PartialType(CreateSubscriptionPlanDto) {
  @ApiPropertyOptional({ example: 'Premium Plus' })
  name?: string;

  @ApiPropertyOptional({ example: 129.99 })
  price?: number;

  @ApiPropertyOptional({ example: 30, description: 'Plan duration in days' })
  duration?: number;

  @ApiPropertyOptional({ example: '4K streaming, 6 devices, no ads' })
  features?: string;
}
