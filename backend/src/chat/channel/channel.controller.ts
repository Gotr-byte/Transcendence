import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/auth.decorator';
import { ShowChannelDto, ShowChannelsDto } from '../shared/dto';
import { JoinChannelDto, ShowUsersRoles } from './dto';

@UseGuards(AuthenticatedGuard)
@Controller('chat/channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // Retrieves all public and protected channels in that the
  // logged-in user is not blocked on
  // ADD channels where user is member in should not be shown

  @Get('visible')
  async getNonMemberChannels(@AuthUser() user: User): Promise<ShowChannelsDto> {
    const channels = await this.channelService.getNonMemberChannels(user.id);
    return channels;
  }

  @Get('memberships')
  async getUserChannels(@AuthUser() user: User): Promise<ShowChannelsDto> {
    const channels = await this.channelService.getUserChannels(user.id);
    return channels;
  }

  @Get('id/:channelId')
  async getChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<ShowChannelDto> {
    const channel = await this.channelService.getChannel(+channelId, user.id);
    return channel;
  }

  @Get('id/:channelId/users')
  async getChannelUsers(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<ShowUsersRoles> {
    const userList = await this.channelService.getChannelUsers(
      +channelId,
      user.id,
    );
    return userList;
  }

  @Post('id/:channelId/join')
  async joinChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
    @Body() joinChannelDto: JoinChannelDto,
  ): Promise<string> {
    await this.channelService.joinChannel(+channelId, user.id, joinChannelDto);
    return `User: '${user.username}' has joined channelId: '${channelId}'`;
  }

  @Delete('id/:channelId/leave')
  async leaveChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<string> {
    await this.channelService.leaveChannel(+channelId, user.id);
    return `User: '${user.username}' has left channelId: '${channelId}'`;
  }
}
