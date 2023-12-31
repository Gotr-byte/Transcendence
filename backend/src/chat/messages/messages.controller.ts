import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateChannelMessageDto } from './dto';
import { AuthenticatedGuard } from 'src/auth/guards/http-guards';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/auth.decorator';
import { Message, User } from '@prisma/client';
import { ShowMessagesDto } from './dto/show-messages.dto';
import { UsernameId } from './types/types';

@UseGuards(AuthenticatedGuard)
@ApiTags('Chat: messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // @Post('channel/:channelId')
  // @ApiOperation({
  //   summary:
  //     'Send a message to a channel the user is member in and not muted on',
  // })
  // @ApiParam({
  //   name: 'channelId',
  //   description: 'ID of the channel to send the message to',
  // })
  // @ApiBody({
  //   type: CreateMessageDto,
  //   examples: {
  //     example1: {
  //       value: {
  //         content: 'Text of the Message',
  //       },
  //     },
  //   },
  // })
  // async createChannelMessage(
  //   @Param('channelId') channelId: string,
  //   @Body() createMessageDto: CreateMessageDto,
  //   @AuthUser() user: User,
  // ): Promise<Message> {
  //   const newMessage = await this.messagesService.createChannelMessage(
  //     user.id,
  //     +channelId,
  //     createMessageDto,
  //   );
  //   return newMessage;
  // }

  // @Post('user/:username')
  // @ApiOperation({ summary: 'Send a message to a user' })
  // @ApiParam({
  //   name: 'username',
  //   description: 'Username to send the message to',
  // })
  // @ApiBody({
  //   type: CreateMessageDto,
  //   examples: {
  //     example1: {
  //       value: {
  //         content: 'Text of the Message',
  //       },
  //     },
  //   },
  // })
  // async createUserMessage(
  //   @Param('username') username: string,
  //   @Body() createMessageDto: CreateMessageDto,
  //   @AuthUser() user: User,
  // ) {
  //   const newMessage = await this.messagesService.createUserMessage(
  //     user.id,
  //     username,
  //     createMessageDto,
  //   );
  //   return newMessage;
  // }

  @Get('channel/:channelId')
  @ApiOperation({
    summary:
      'Get all messages from a channel, where the logged user is member of, includes usernames, excludes messages from blocked users',
  })
  @ApiParam({
    name: 'channelId',
    description: 'ID of the channel to get the messages from',
  })
  async GetChannelMessages(
    @Param('channelId') channelId: string,
    @AuthUser() user: User,
  ): Promise<ShowMessagesDto> {
    const newMessage = await this.messagesService.getChannelMessages(
      user.id,
      +channelId,
    );
    return newMessage;
  }

  @Get('user/:username')
  @ApiOperation({
    summary:
      'Get all messages from a user to user chat, includes usernames, excludes messages from blocked users',
  })
  @ApiParam({
    name: 'username',
    description: 'Username to get message history',
  })
  async GetUserMessages(
    @Param('username') username: string,
    @AuthUser() user: User,
  ): Promise<ShowMessagesDto> {
    const messages = await this.messagesService.getUserMessages(
      user.id,
      username,
    );
    return messages;
  }

  @Get('chats')
  @ApiOperation({
    summary:
      'Gets all open user-user chats from the logged in user, newest chat on top',
  })
  async GetUserChats(@AuthUser() user: User): Promise<UsernameId[]> {
    const chats = await this.messagesService.getUserChats(user.id);
    return chats;
  }
}
