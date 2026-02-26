import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RolesGuard } from '../auth/roles.guard';
import { AdminProfilesController } from './admin-profiles.controller';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController, AdminProfilesController],
  providers: [ProfileService, PrismaService, RolesGuard],
})
export class ProfileModule {}
