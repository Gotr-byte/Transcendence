import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/auth.decorator';
import { Message, User } from '@prisma/client';

@UseGuards(AuthenticatedGuard)
@ApiTags('Chat: messages || not working, in progress')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('channel/:channelId')
  async createChannelMessage(
    @Param('channelId') channelId: string,
    @Body() createMessageDto: CreateMessageDto,
    @AuthUser() user: User,
  ): Promise<Message> {
    const newMessage = await this.messagesService.createChannelMessage(
      +channelId,
      user.id,
      createMessageDto,
    );
    return newMessage;
  }

  @Post('user/:username')
  async createUserMessage(
    @Param('username') username: string,
    @Body() createMessageDto: CreateMessageDto,
    @AuthUser() user: User,
  ) {
    const newMessage = await this.messagesService.createUserMessage(
      user.id,
      username,
      createMessageDto,
    );
    return newMessage;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }
}
