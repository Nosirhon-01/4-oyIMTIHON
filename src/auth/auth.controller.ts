import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: "Ro'yxatdan o'tish",
    description:
      "Yangi foydalanuvchini ro'yxatdan o'tkazadi va unga USER rolini biriktiradi.",
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi." })
  @ApiResponse({ status: 400, description: "Username yoki email allaqachon band." })
  async register(@Body() body: RegisterDto) {
    try {
      return await this.authService.register(body.username, body.email, body.password);
    } catch (error) {
      throw new HttpException("Foydalanuvchi allaqachon mavjud", HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiOperation({
    summary: 'Tizimga kirish',
    description:
      "Foydalanuvchini tizimga kiritadi va JWT access token qaytaradi. Tokenni bearer yoki cookie orqali ishlatish mumkin.",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli login qilindi.' })
  @ApiResponse({ status: 401, description: "Login yoki parol noto'g'ri." })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const loginValue = body.login || body.email || body.username;
      if (!loginValue) {
        throw new HttpException("email yoki username kiriting", HttpStatus.BAD_REQUEST);
      }

      const result = await this.authService.login(loginValue, body.password);
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        sameSite: 'lax',
      });
      return result;
    } catch (error) {
      throw new HttpException("Noto'g'ri login ma'lumotlari", HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({
    summary: 'Tizimdan chiqish',
    description: "Joriy sessiyani yakunlaydi va auth cookie ni tozalaydi.",
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli tizimdan chiqildi.' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return { success: true, message: "Muvaffaqiyatli tizimdan chiqildi" };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({
    summary: 'Joriy foydalanuvchi',
    description: "Autentifikatsiyadan o'tgan joriy foydalanuvchi ma'lumotlarini qaytaradi.",
  })
  @ApiResponse({ status: 200, description: "Joriy foydalanuvchi ma'lumotlari." })
  async getCurrentUser(@Req() req: Request & { user: any }) {
    return { success: true, data: req.user };
  }
}
