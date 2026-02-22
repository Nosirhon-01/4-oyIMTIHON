import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  async register(@Body() body: { username: string; email: string; password: string }) {
    try {
      return await this.authService.register(body.username, body.email, body.password);
    } catch (error) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
  }

 
  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: { username: string; password: string }) {
    try {
      return await this.authService.login(body.username, body.password);
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'User data' })
  async getCurrentUser(@Request() req: any) {
    return { message: 'You are authenticated', user: req.user };
  }
}
