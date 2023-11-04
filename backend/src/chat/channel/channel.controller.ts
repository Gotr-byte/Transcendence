import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelId } from './channel.decorator';
import { ChannelIdValidationPipe } from 'src/filters/channel-validation-pipe';
import { AuthenticatedGuard } from 'src/auth/guards/http-guards';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/auth.decorator';
import { ShowChannelDto, ShowChannelsDto } from '../shared/dto';
import { JoinChannelDto, ShowUsersRoles } from './dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthenticatedGuard)
@ApiTags('Chat: channel-user-operations')
@Controller('chat/channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // Retrieves all public and protected channels in that the
  // logged-in user is not blocked on
  // ADD channels where user is member in should not be shown

  @Get('visible')
  @ApiOperation({
    summary:
      'Get all public and protected channels where logged user is not blocked on and not member of',
  })
  async getNonMemberChannels(@AuthUser() user: User): Promise<ShowChannelsDto> {
    const channels = await this.channelService.getNonMemberChannels(user.id);
    return channels;
  }

  @Get('memberships')
  @ApiOperation({
    summary: 'Get all channels where logged user is member',
  })
  async getUserChannels(@AuthUser() user: User): Promise<ShowChannelsDto> {
    const channels = await this.channelService.getUserChannels(user.id);
    return channels;
  }

  @Get('id/:channelId')
  @ApiOperation({ summary: 'Get a visible channel by ID' })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  async getChannel(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,
    @AuthUser() user: User,
  ): Promise<ShowChannelDto> {
    const channel = await this.channelService.getChannel(+channelId, user.id);
    return channel;
  }

  @Get('id/:channelId/users')
  @ApiOperation({
    summary:
      'Get users of a visible channel by ID, including channel roles and usersNo',
  })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  async getChannelUsers(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,
    @AuthUser() user: User,
  ): Promise<ShowUsersRoles> {
    if (1000 < +channelId)
      throw new BadRequestException('ChannelId is too big');
    const userList = await this.channelService.getChannelUsers(
      +channelId,
      user.id,
    );
    return userList;
  }

  @Post('id/:channelId/join')
  @ApiOperation({ summary: 'Join a visible channel' })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  @ApiBody({
    type: JoinChannelDto,
    examples: {
      example1: {
        value: {
          password: 'mandatory for PROTECTED channel',
        },
      },
    },
  })
  async joinChannel(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,
    @AuthUser() user: User,
    @Body() joinChannelDto: JoinChannelDto,
  ): Promise<string> {
    await this.channelService.joinChannel(+channelId, user.id, joinChannelDto);
    return `User: '${user.username}' has joined channelId: '${channelId}'`;
  }

  @Delete('id/:channelId/leave')
  @ApiOperation({
    summary:
      'Leave a channel where logged user is member in. If the last member of the channel leaves the channel, the channel will be deleted, with its restrictions and messages',
  })
  async leaveChannel(
    @ChannelId() @Param('channelId', ChannelIdValidationPipe) channelId: number,
    @AuthUser() user: User,
  ): Promise<string> {
    await this.channelService.leaveChannel(+channelId, user.id);
    return `User: '${user.username}' has left channelId: '${channelId}'`;
  }
}
