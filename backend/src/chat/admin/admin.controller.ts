import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Get,
  Patch,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  CreateRestrictionDto,
  ShowUsersRolesRestrictions,
  UpdateRestrictionDto,
} from './dto';
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
    @AuthUser() admin: User,
  ): Promise<ShowUsersRolesRestrictions> {
    const users = await this.adminService.getChannelUsersAsAdmin(
      +channelId,
      admin.id,
    );
    return users;
  }

  @Get('id/:channelId/restricted')
  async getMutedUsers(
    @Param('channelId') channelId: string,
    @AuthUser() admin: User,
  ) {
    const users = await this.adminService.getRestrictedUsers(
      +channelId,
      admin.id,
    );
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

  @Post('id/:channelId/:username/restrict')
  async restrictUser(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @AuthUser() admin: User,
    @Body() createRestrictionDto: CreateRestrictionDto,
  ): Promise<ChannelUserRestriction> {
    const newRestriction = await this.adminService.createOrUpdateRestriction(
      +channelId,
      username,
      admin.id,
      createRestrictionDto,
    );
    return newRestriction;
  }

  @Patch('id/:channelId/:username/restrict')
  async updateRestriction(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @AuthUser() admin: User,
    @Body() updateRestrictionDto: UpdateRestrictionDto,
  ): Promise<ChannelUserRestriction> {
    const newRestriction = await this.adminService.createOrUpdateRestriction(
      +channelId,
      username,
      admin.id,
      updateRestrictionDto,
    );
    return newRestriction;
  }

  @Delete('id/:channelId/:username/liberate')
  async liberateUser(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @AuthUser() admin: User,
  ): Promise<string> {
    await this.adminService.liberateUser(+channelId, username, admin.id);
    return `User '${username}' is no longer restricted this channel (ID:'${channelId}'), he was liberated by '${admin.username}'`;
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
