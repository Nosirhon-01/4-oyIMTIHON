import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'alijon' })
  username: string;

  @ApiProperty({ example: 'alijon@example.com' })
  email: string;

  @ApiProperty({ example: '12345678' })
  password: string;
}
