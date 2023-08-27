import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channels.service';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';
import {
  ShowChannelDto,
  ShowChannelsDto,
  JoinChannelDto,
  ChannelDto,
  EditChannelDto,
} from './dto';
import { AddUsersDto } from 'src/user/dto';

@UseGuards(AuthenticatedGuard)
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // Retrieves all public and protected channels in that the
  // logged-in user is not blocked on
  @Get()
  async getNonPrivateChannels(
    @AuthUser() user: User,
  ): Promise<ShowChannelsDto> {
    const channels = await this.channelService.getNonPrivateChannels(user.id);
    return channels;
  }

  // Gets all channels, the user is member of and the user is not blocked on
  @Get('users')
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



  @Post('id/:channelId/add')
  async addUsersToChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
    @Body() addUsersDto: AddUsersDto,
  ): Promise<string> {
    const addedUserNo = await this.channelService.addUsersToChannel(
      user.id,
      +channelId,
      addUsersDto.users,
    );
    return `Added ${addedUserNo} users to channelId: '${channelId}'`;
  }

  @Post('id/:channelId/join')
  async joinChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
    @Body() joinChannelDto: JoinChannelDto,
  ): Promise<string> {
    await this.channelService.joinChannel(user.id, +channelId, joinChannelDto);
    return `User: '${user.username}' has joined channelId: '${channelId}'`;
  }

  @Delete('id/:channeldId/leave')
  async leaveChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<string> {
    await this.channelService.leaveChannel(user.id, +channelId);
    return `User: '${user.username}' has left channelId: '${channelId}'`;
  }

}
