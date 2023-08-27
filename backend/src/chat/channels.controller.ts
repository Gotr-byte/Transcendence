import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channels.service';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { ChannelTypes, User } from '@prisma/client';
import {
  ShowChannelDto,
  ShowChannelsDto,
  CreateChannelDto,
  JoinChannelDto,
} from './dto';
import { AddUsersDto } from 'src/user/dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthenticatedGuard)
@ApiTags('Channels')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get all public and protected channels where logged user is not blocked on',
  })
  async getNonPrivateChannels(
    @AuthUser() user: User,
  ): Promise<ShowChannelsDto> {
    const channels = await this.channelService.getNonPrivateChannels(user.id);
    return channels;
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a channel' })
  @ApiBody({
    type: CreateChannelDto,
    examples: {
      example1: {
        value: {
          title: 'Sample Channel',
          channelType: 'PUBLIC or PROTECTED',
          password: 'optional-password for Public but mandatory for Protected',
        },
      },
    },
  })
  async createChannel(
    @AuthUser() user: User,
    @Body() dto: CreateChannelDto,
  ): Promise<ShowChannelDto> {
    if (dto.channelType === ChannelTypes.PROTECTED && !dto.password)
      throw new BadRequestException(
        'Password is missing to create PROTECTED CHANNEL',
      );
    const channel = await this.channelService.createChannel(user.id, dto);
    return channel;
  }

  @Get('user')
  @ApiOperation({
    summary:
      'Get all channels where the user is member of and the user is not blocked on',
  })
  async getUserChannels(@AuthUser() user: User): Promise<ShowChannelsDto> {
    const channels = await this.channelService.getUserChannels(user.id);
    return channels;
  }

  @Get('id/:channelId')
  @ApiOperation({ summary: 'Get a channel by ID' })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  async getChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<ShowChannelDto> {
    const channel = await this.channelService.getChannel(+channelId, user.id);
    return channel;
  }

  @Post('id/:channelId/add')
  @ApiOperation({ summary: 'Add user/s to a channel' })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  @ApiBody({
    type: AddUsersDto,
    examples: {
      example1: {
        value: {
          usersIds: [1, 2],
        },
      },
    },
  })
  async addUsersToChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
    @Body() dto: AddUsersDto,
  ): Promise<string> {
    const addedUserNo = await this.channelService.addUsersToChannel(
      user.id,
      +channelId,
      dto.users,
    );
    return `Added ${addedUserNo} users to channelId: '${channelId}'`;
  }

  // @Post('id/:channelId/join')
  // async joinChannel(
  //   @Param('channelId') channelId: string,
  //   @AuthUser() user: User,
  //   @Body() dto: JoinChannelDto,
  // ) {
  //   const joinChannel = await this.channelService.joinChannel(user.id, +channelId, dto.password)
  //   return `User: '${user.username}' was added to channelId: '${channelId}'`
  // }
}
