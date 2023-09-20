import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { AuthenticatedGuard } from 'src/auth/guards/http-guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';
import { CreateChannelDto, UpdateChannelDto } from './dto';
import { ChannelDto, ShowChannelDto } from '../shared/dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthenticatedGuard)
@ApiTags('Chat: channel-creator-operations')
@Controller('chat/management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new Channel, user is set to creator and admin',
  })
  @ApiBody({
    type: CreateChannelDto,
    examples: {
      example1: {
        value: {
          title: 'Sample Channel',
          channelType: 'PUBLIC, PROTECTED or PRIVATE',
          password: 'only mandatory for PROTECTED channel',
        },
      },
    },
  })
  async createChannel(
    @AuthUser() user: User,
    @Body() createUserDto: CreateChannelDto,
  ): Promise<ShowChannelDto> {
    const channel = await this.managementService.createChannel(
      user.id,
      createUserDto,
    );
    return channel;
  }

  @Patch('id/:channelId/edit')
  @ApiOperation({ summary: 'Edit Channel, only possible for channel creator' })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  @ApiBody({
    type: UpdateChannelDto,
    examples: {
      example1: {
        value: {
          title: 'optional: Edited Channel',
          channelType: 'optional: PUBLIC, PROTECTED or PRIVATE',
          password: 'only mandatory for PROTECTED channel',
        },
      },
    },
  })
  async editChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
    @Body() editChannelDto: UpdateChannelDto,
  ): Promise<ChannelDto> {
    const channel = await this.managementService.editChannel(
      +channelId,
      user.id,
      editChannelDto,
    );
    return channel;
  }

  @Delete('id/:channelId')
  @ApiOperation({
    summary:
      'Delete Channel, only possible for channel creator, deletes all messages, restrictions and memberships of channel',
  })
  @ApiParam({ name: 'channelId', description: 'ID of the channel' })
  async deleteChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<string> {
    await this.managementService.deleteChannel(+channelId, user.id);
    return `Channel with ID: ${channelId} was deleted with all containing messages and restrictions by ${user.username}`;
  }
}
