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
  ShowUsersRestrictions,
  ShowUsersRolesRestrictions,
  UpdateRoleDto,
  RestrictionDto,
} from './dto';
import { ChannelId } from '../channel/channel.decorator';
import { ChannelIdValidationPipe } from 'src/filters/channel-validation-pipe';
import { AuthUser } from 'src/auth/auth.decorator';
import { ChannelMember, ChannelUserRestriction, User } from '@prisma/client';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/guards/http-guards';

@UseGuards(AuthenticatedGuard)
@ApiTags('Chat: channel-admin-operations')
@Controller('chat/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('id/:channelId/users')
  @ApiOperation({
    summary:
      'Get users of a channel by ID, if logged user is admin. Includes roles, restrictions, duration and usersNo',
  })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  async getChannelUsersAsAdmin(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,    @AuthUser() admin: User,
  ): Promise<ShowUsersRolesRestrictions> {
    const users = await this.adminService.getChannelUsersAsAdmin(
      +channelId,
      admin.id,
    );
    return users;
  }

  @Get('id/:channelId/restricted')
  @ApiOperation({
    summary:
      'Get restricted users of a channel by ID, where logged user is admin of. Includes user, restrictions, duration and usersNo',
  })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  async getMutedUsers(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,    @AuthUser() admin: User,
  ): Promise<ShowUsersRestrictions> {
    const users = await this.adminService.getRestrictedUsers(
      +channelId,
      admin.id,
    );
    return users;
  }

  @Post('id/:channelId/:username/add')
  @ApiOperation({
    summary:
      'Add user to a channel if logged user is admin, and user to add is not BANNED',
  })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  @ApiParam({ name: 'username', description: 'username to add' })
  async addUserToChannel(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,    @Param('username') username: string,
    @AuthUser() admin: User,
  ): Promise<string> {
    await this.adminService.addUserToChannel(+channelId, admin.id, username);
    return `${admin.username} added ${username} to channelId: '${channelId}'`;
  }

  @Post('id/:channelId/:username/restrict')
  @ApiOperation({
    summary:
      'Restrict any user (excluding the channel creator) on the channel, if logged user is admin',
  })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  @ApiParam({ name: 'username', description: 'username to restrict' })
  @ApiBody({
    type: RestrictionDto,
    examples: {
      example1: {
        value: {
          restrictionType: 'BANNED or MUTED',
          duration:
            'optional-duration for the restriction in JS Date format, if empty: indefinite restriction',
        },
      },
    },
  })
  async restrictUser(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,    @Param('username') username: string,
    @AuthUser() admin: User,
    @Body() createRestrictionDto: RestrictionDto,
  ): Promise<ChannelUserRestriction> {
    createRestrictionDto.actionType = 'create';
    const newRestriction = await this.adminService.createOrUpdateRestriction(
      +channelId,
      username,
      admin.id,
      createRestrictionDto,
    );
    return newRestriction;
  }

  @Patch('id/:channelId/:username/restrict')
  @ApiOperation({ summary: 'Update a restriction, if logged user is admin' })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  @ApiParam({ name: 'username', description: 'username to restrict' })
  @ApiBody({
    type: RestrictionDto,
    examples: {
      example1: {
        value: {
          restrictionType: 'optional-restrictionType BANNED or MUTED',
          duration:
            'optional-duration for the restriction in JS Date format (2023-09-30T10:07:07.000Z), if empty: indefinite restriction',
        },
      },
    },
  })
  async updateRestriction(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,    @Param('username') username: string,
    @AuthUser() admin: User,
    @Body() updateRestrictionDto: RestrictionDto,
  ): Promise<ChannelUserRestriction> {
    updateRestrictionDto.actionType = 'update';
    const newRestriction = await this.adminService.createOrUpdateRestriction(
      +channelId,
      username,
      admin.id,
      updateRestrictionDto,
    );
    return newRestriction;
  }

  @Patch('id/:channelId/:username/update-role')
  @ApiOperation({ summary: 'Update a users role' })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  @ApiParam({ name: 'username', description: 'username to restrict' })
  @ApiBody({
    type: UpdateRoleDto,
    examples: {
      example1: {
        value: {
          role: 'USER OR ADMIN',
        },
      },
    },
  })
  async updateRole(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,
    @Param('username') username: string,
    @AuthUser() admin: User,
    @Body() updateRole: UpdateRoleDto,
  ): Promise<ChannelMember> {
    const membership = await this.adminService.updateRole(
      +channelId,
      username,
      admin.id,
      updateRole,
    );
    
    return membership;
  }

  @Delete('id/:channelId/:username/liberate')
  @ApiOperation({ summary: 'Delete a restriction, if logged user is admin' })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  @ApiParam({ name: 'username', description: 'username to liberate' })
  async liberateUser(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,    @Param('username') username: string,
    @AuthUser() admin: User,
  ): Promise<string> {
    await this.adminService.liberateUser(+channelId, username, admin.id);
    return `User '${username}' is no longer restricted this channel (ID:'${channelId}'), he was liberated by '${admin.username}'`;
  }

  @Delete('id/:channelId/:username/kick')
  @ApiOperation({
    summary:
      'Kick any user (excluding the channel creator), if logged user is admin',
  })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  @ApiParam({ name: 'username', description: 'username to kick' })
  async kickUser(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number, @Param('username') username: string,
    @AuthUser() admin: User,
  ): Promise<string> {
    await this.adminService.kickUser(+channelId, username, admin.id);
    return `User '${username}' was kicked from channel with ID: '${channelId}' by '${admin.username}'`;
  }
}

