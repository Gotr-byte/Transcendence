import { Injectable } from '@nestjs/common';
import {
  CreateChannelMessageDto,
  CreateUserMessageDto,
  ShowMessageDto,
} from './messages/dto';
import { MessagesService } from './messages/messages.service';
import { ChannelService } from './channel/channel.service';
import { BlockingService } from 'src/user/user-relations/blocking/blocking.service';
import { ChatSharedService } from './shared/chat-shared.service';
import { UserService } from 'src/user/user.service';
import { SocketService } from 'src/socket/socket.service';
import { ChatEvent } from './types';

@Injectable()
export class ChatService {
  constructor(
    private readonly channelService: ChannelService,
    private readonly messagesService: MessagesService,
    private readonly socketService: SocketService,
    private readonly blockingService: BlockingService,
    private readonly chatSharedService: ChatSharedService,
    private readonly userService: UserService,
  ) {}

  async handleUserConnection(userId: number) {
    const userChats = await this.messagesService.getUserChats(userId);
    const rooms = userChats.map((user) => {
      return [userId, user.id].sort().join('_');
    });

    await this.chatSharedService.removeExpiredChannelRestrictions(userId);

    return rooms;
  }

  async handleChannelMessage(
    userId: number,
    channelMessageDto: CreateChannelMessageDto,
  ): Promise<ChatEvent[]> {
    const savedMessage = await this.saveChannelMessage(
      userId,
      channelMessageDto,
    );
    const chatEvents = await this.prepChannelEvents(userId, savedMessage);
    return chatEvents;
  }

  async saveChannelMessage(
    userId: number,
    channelMessageDto: CreateChannelMessageDto,
  ): Promise<ShowMessageDto> {
    return await this.messagesService.createChannelMessage(
      userId,
      channelMessageDto,
    );
  }

  async prepChannelEvents(
    userId: number,
    savedMessage: ShowMessageDto,
  ): Promise<ChatEvent[]> {
    console.log(savedMessage);
    const channelId = savedMessage.receivingChannelId;
    if (!channelId) throw new Error('Channel Id is Missing');
    // Fetch the channel members excluding the message sender
    const channelMembers = await this.channelService.getChannelUsers(
      channelId,
      userId,
    );
    const channel = await this.channelService.getChannel(channelId, userId);

    const chatEvents: ChatEvent[] = [];

    // Send message to members and check blocking logic
    for (const member of channelMembers.users) {
      if (member.isOnline && !(await this.userIsBlocked(userId, member.id))) {
        chatEvents.push({
          receiverId: member.id,
          event: `channel-msg-${channelId}`,
          message: savedMessage,
          notification: {
            type: 'channel-message',
            message: `New Message in Channel ${channel.channel.title}`,
            channelId: `${channelId}`,
            event: `channel-msg-${channelId}`,
          },
        });
      }
    }
    return chatEvents;
  }

  async getUserIdFromSocket(socketId: string): Promise<number> {
    return await this.socketService.getUserId(socketId);
  }

  async getSocketIdsFromUserId(userId: number): Promise<string[]> {
    return await this.socketService.getSocketIds(userId);
  }

  async handleUserMessage(
    userId: number,
    userMessageDto: CreateUserMessageDto,
  ): Promise<ChatEvent> {
    const savedMessage = await this.saveUserMessage(userId, userMessageDto);
    const chatEvents = await this.prepUserEvents(userId, savedMessage);
    return chatEvents;
  }

  async saveUserMessage(
    userId: number,
    userMessageDto: CreateUserMessageDto,
  ): Promise<ShowMessageDto> {
    return await this.messagesService.createUserMessage(userId, userMessageDto);
  }

  async prepUserEvents(
    userId: number,
    savedMessage: ShowMessageDto,
  ): Promise<ChatEvent> {
    console.log(savedMessage);
    const receiverId = savedMessage.receivingUserId;
    if (!receiverId) throw new Error('ReceiverId is missing');

    const chatEvent: ChatEvent = {
      receiverId: +receiverId,
      event: `user-msg-${userId}`,
      message: savedMessage,
      notification: {
        type: 'user-message',
        message: `New Message from ${savedMessage.sender}`,
        userId: `${userId}`,
        event: `user-msg-${userId}`,
      },
    };
    return chatEvent;
  }

  async userIsBlocked(receiverId: number, userId: number): Promise<boolean> {
    return await this.blockingService.isBlockedBy(receiverId, userId);
  }
}
