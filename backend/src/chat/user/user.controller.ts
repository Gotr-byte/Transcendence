import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JoinChannelDto } from './dto/join-channel.dto';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/auth.decorator';
import { ShowChannelsDto } from '../shared/dto/show-channels.dto';
import { ShowChannelDto } from '../shared/dto/show-channel.dto';

@UseGuards(AuthenticatedGuard)
@Controller('chat/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Retrieves all public and protected channels in that the
  // logged-in user is not blocked on
  // ADD channels where user is member in should not be shown
  @Get('all')
  async getNonPrivateChannels(
    @AuthUser() user: User,
  ): Promise<ShowChannelsDto> {
    const channels = await this.userService.getNonPrivateChannels(user.id);
    return channels;
  }

  @Get('memberships')
  async getUserChannels(@AuthUser() user: User): Promise<ShowChannelsDto> {
    const channels = await this.userService.getUserChannels(user.id);
    return channels;
  }

  @Get('id/:channelId')
  async getChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<ShowChannelDto> {
    const channel = await this.userService.getChannel(+channelId, user.id);
    return channel;
  }

  @Post('id/:channelId/join')
  async joinChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
    @Body() joinChannelDto: JoinChannelDto,
  ): Promise<string> {
    await this.userService.joinChannel(user.id, +channelId, joinChannelDto);
    return `User: '${user.username}' has joined channelId: '${channelId}'`;
  }

  @Delete('id/:channeldId/leave')
  async leaveChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<string> {
    await this.userService.leaveChannel(user.id, +channelId);
    return `User: '${user.username}' has left channelId: '${channelId}'`;
  }
}
