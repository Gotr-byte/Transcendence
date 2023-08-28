import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ShowUsersRolesRestrictions } from './dto';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { ChannelUserRestriction, User } from '@prisma/client';

@UseGuards(AuthenticatedGuard)
@Controller('chat/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('id/:channelId/users')
  async getChannelUsersAsAdmin(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<ShowUsersRolesRestrictions> {
    const users = await this.adminService.getChannelUsersAsAdmin(
      +channelId,
      user.id,
    );
    return users;
  }

  @Post('id/:channelId/:username/add')
  async addUserToChannel(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @AuthUser() admin: User,
  ): Promise<string> {
    const newMembership = await this.adminService.addUserToChannel(
      +channelId,
      admin.id,
      username,
    );
    return `${admin.username} added ${username} to channelId: '${channelId}'`;
  }

  @Post('id/:channelId/:username/mute')
  async muteUser(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @AuthUser() admin: User,
  ): Promise<ChannelUserRestriction> {
    const newMute = await this.adminService.muteUser(
      +channelId,
      username,
      admin.id,
    );
    return newMute;
  }

  @Post('id/:channelId/:username/ban')
  async banUser(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @AuthUser() admin: User,
  ): Promise<ChannelUserRestriction> {
    const newBan = await this.adminService.banUser(
      +channelId,
      username,
      admin.id,
    );
    return newBan
  }

  @Delete('id/:channelId/:username/liberate')
  async liberateUser(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @AuthUser() admin: User,
  ): Promise<string> {
    await this.adminService.liberateUser(
      +channelId,
      username,
      admin.id,
    );
    return `User '${username}' is no longer restricted this channel (ID:'${channelId}'), he was liberated by '${admin.username}'`
  }

  @Delete('id/:channelId/:username/kick')
  async kickUser(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @AuthUser() admin: User,
  ): Promise<string> {
    await this.adminService.kickUser(+channelId, username, admin.id);
    return `User '${username}' was kicked from channel with ID: '${channelId}' by '${admin.username}'`;
  }
}
