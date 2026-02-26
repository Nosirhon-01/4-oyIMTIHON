import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiPropertyOptional({ example: 'alijon' })
  login?: string;

  @ApiPropertyOptional({ example: 'alijon@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'alijon' })
  username?: string;

  @ApiProperty({ example: '12345678' })
  password: string;
}
