import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

const cookieExtractor = (req: Request): string | null => {
  const cookieHeader = req?.headers?.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';').map((item) => item.trim());
  const tokenCookie = cookies.find((item) => item.startsWith('auth_token=')); // startsWith - String boshidan tekshiradi
  if (!tokenCookie) return null;

  const [, value] = tokenCookie.split('=');
  if (!value) return null;

  return decodeURIComponent(value); //decodeURIComponent -  URL ichida kodlangan matnni asl holatiga qaytarar ekan
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'KIASORENTO',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { userId: user.id, username: user.username, role: user.role };
  }
}
