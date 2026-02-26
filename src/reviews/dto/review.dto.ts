import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  rating: number;

  @ApiPropertyOptional({ example: 'Amazing movie! Highly recommended.' })
  comment?: string;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
