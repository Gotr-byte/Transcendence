import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddUsersDto } from './dto/add-users.dto';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';

@UseGuards(AuthenticatedGuard)
@Controller('chat/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('id/:channelId/add')
  async addUsersToChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
    @Body() addUsersDto: AddUsersDto,
  ): Promise<string> {
    const addedUserNo = await this.adminService.addUsersToChannel(
      user.id,
      +channelId,
      addUsersDto.users,
    );
    return `Added ${addedUserNo} users to channelId: '${channelId}'`;
  }

  @Delete('id/:channeldId/:userId/kick')
  async kickUser(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @AuthUser() user: User,
  ): Promise<string> {
    await this.adminService.kickUser(+channelId, +userId, user.id);
    return `User with ID: '${userId}' was kicked from channel with ID: '${channelId}' by '${user.username}'`;
  }

}
