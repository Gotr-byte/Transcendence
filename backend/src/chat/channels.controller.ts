import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from './channels.service';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';
import { ShowChannelDto, ShowChannelsDto } from './dto';

@UseGuards(AuthenticatedGuard)
@Controller('channels')
export class ChannelController {
  constructor(private readonly chatService: ChannelService) {}

  // Retrieves all public and protected channels in that the
  // logged-in user is not blocked on
  @Get()
  async getNonPrivateChannels(
    @AuthUser() user: User,
  ): Promise<ShowChannelsDto> {
    const channels = await this.chatService.getNonPrivateChannels(user.id);
    return channels;
  }

  @Post()
  async openChannel(
    @AuthUser() user: User,
  ): Promise<string> {

    return "Channel "
  }

  // Gets all channels, the user is member of and the user is not blocked on
  @Get('user')
  async getUserChannels(@AuthUser() user: User): Promise<ShowChannelsDto> {
    const channels = await this.chatService.getUserChannels(user.id);
    return channels;
  }

  @Get('name/:channelName')
  async getChannel(
    @Param('channelName') channelName: string,
    @AuthUser() user: User,
  ): Promise<ShowChannelDto> {
    const channel = await this.chatService.getChannel(channelName, user.id);
    return channel;
  }
}
