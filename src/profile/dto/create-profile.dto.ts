import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiPropertyOptional({ example: 'Aliyev Valijon' })
  fullName?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Uzbekistan' })
  country?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatarUrl?: string;
}
