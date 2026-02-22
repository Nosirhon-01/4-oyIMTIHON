import { Controller, Get, Put, Body, Param, UseGuards, Delete, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuperadminGuard } from '../auth/guards';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: any) {
    return this.usersService.getUserProfile(req.user.userId);
  }

  
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfileMethod(
    @Body() body: { fullName?: string; phone?: string; country?: string },
    @Request() req: any,
  ) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

 
  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users (superadmin only)' })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (superadmin only)' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(parseInt(id));
  }
}
