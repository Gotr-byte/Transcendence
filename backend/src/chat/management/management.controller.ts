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
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';
import { CreateChannelDto, UpdateChannelDto } from './dto';
import { ChannelDto, ShowChannelDto } from '../shared/dto';

@UseGuards(AuthenticatedGuard)
@Controller('chat/management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Post('create')
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
  async editChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
    @Body() editChannelDto: UpdateChannelDto,
  ): Promise<ChannelDto> {
    const channel = await this.managementService.editChannel(
      user.id,
      +channelId,
      editChannelDto,
    );
    return channel;
  }

  @Delete('id/:channelId')
  async deleteChannel(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<string> {
    return `Channel with ID: ${channelId} was deleted with all containing messages and restrictions by ${user.username}`;
  }
}
