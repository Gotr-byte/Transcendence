import {
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChannelMessageDto, CreateUserMessageDto } from './messages/dto';
import { MessagesService } from './messages/messages.service';
import { SocketService } from 'src/socket/socket.service';
import { ChannelService } from './channel/channel.service';
import { BlockingService } from 'src/user/user-relations/blocking/blocking.service';
import { ChatSharedService } from './shared/chat-shared.service';
import { UserService } from 'src/user/user.service';
// import { UseGuards } from '@nestjs/common';
// import { SocketSessionGuard } from 'src/auth/guards/socket-guards';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL } })
// @UseGuards(SocketSessionGuard)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private readonly channelService: ChannelService,
    private readonly messagesService: MessagesService,
    private readonly socketService: SocketService,
    private readonly blockingService: BlockingService,
    private readonly chatSharedService: ChatSharedService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId as string;
    const memberships = await this.channelService.getUserChannels(+userId);
    memberships.channels.forEach((channel) => {
      client.join(channel.id.toString());
    });
    const userChats = await this.messagesService.getUserChats(+userId);
    userChats.forEach((user) => {
      const roomName = [userId, user.id].sort().join('_');
      client.join(roomName);
    });
    await this.chatSharedService.removeExpiredChannelRestrictions(+userId);
  }

  @SubscribeMessage('send-channel-message')
  async handleChannelMessage(
    @MessageBody() channelMessageDto: CreateChannelMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = await this.socketService.getUserId(client.id);
    const savedMessage = await this.messagesService.createChannelMessage(
      userId,
      channelMessageDto,
    );

    const channelMembers = await this.channelService.getChannelUsers(
      channelMessageDto.channelId,
      userId,
    );
    const channel = await this.channelService.getChannel(
      channelMessageDto.channelId,
      userId,
    );

    for (const member of channelMembers.users) {
      if (
        member.isOnline &&
        !(await this.blockingService.isBlockedBy(userId, member.id))
      ) {
        if (userId == member.id) {
          client.emit(
            `channel-msg-${channelMessageDto.channelId}`,
            savedMessage,
          );
        } else {
          const memberSocket = this.socketService.getSocketIds(member.id);
          client
            .to(memberSocket)
            .emit(`channel-msg-${channelMessageDto.channelId}`, savedMessage);
          client.to(memberSocket).emit('chat-notifications', {
            type: 'channel-message',
            message: `New Message in Channel ${channel.channel.title}`,
            channelId: `${channelMessageDto.channelId}`,
            event: `channel-msg-${channelMessageDto.channelId}`,
          });
        }
      }
    }
  }

  @SubscribeMessage('send-user-message')
  async handleUserMessage(
    @MessageBody() userMessageDto: CreateUserMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    if (!userMessageDto.receiverId)
      client.emit('error', { message: 'receiverId is missing' });
    const userId = await this.socketService.getUserId(client.id);
    const savedMessage = await this.messagesService.createUserMessage(
      userId,
      userMessageDto,
    );
    const roomName = [userId, userMessageDto.receiverId].sort().join('_');

    if (!client.rooms.has(roomName)) {
      client.join(roomName);
    }

    const receivingSockets = this.socketService.getSocketIds(
      userMessageDto.receiverId,
    );

    receivingSockets.forEach((socketId) => {
      const receivingSocket = this.server.sockets.sockets.get(socketId);
      if (receivingSocket && !receivingSocket.rooms.has(roomName)) {
        receivingSocket.join(roomName);
      }
    });

    const isBlocked = await this.blockingService.isBlockedBy(
      userMessageDto.receiverId,
      userId,
    );

    const user = await this.userService.getUserById(userId);

    if (!isBlocked) {
      client.to(roomName).emit('chat-notifications', {
        type: 'user-message',
        message: `New Message from ${user.username}`,
        userId: `${userId}`,
        event: `user-msg-${userId}`,
      });
      client.to(roomName).emit(`user-msg-${userId}`, savedMessage);
    }
    client.emit(`user-msg-${userMessageDto.receiverId}`, savedMessage);
  }

  @SubscribeMessage('get-my-channels')
  async handleGetMyChannels(@ConnectedSocket() client: Socket): Promise<void> {
    const userId = await this.socketService.getUserId(client.id);
    const userChannels = await this.channelService.getUserChannels(userId);
    client.emit('my-channels', userChannels);
  }

  @SubscribeMessage('get-visible-channels')
  async handleGetVisibleChannels(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = await this.socketService.getUserId(client.id);
    const nonMemberChannels = await this.channelService.getNonMemberChannels(
      userId,
    );
    client.emit('visible-channels', nonMemberChannels);
  }
}
