import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; //PassportModule — bu NestJS ga Passport.js ishlatishga ruxsat beruvchi module ekan bunisi ustoz 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy'; //JwtStrategy — bu NestJS ga JWT tokenni qanday tekshirishni orgatadigan class ekan ustoz
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}