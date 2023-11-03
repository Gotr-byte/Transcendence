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
import { ChatService } from './chat.service';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { WSValidationPipe } from 'src/filters/ws-validation-pipe';
import { WsAuthGuard } from 'src/auth/guards/socket-guards';
import { SocketService } from 'src/socket/socket.service';
import { WsExceptionFilter } from 'src/filters/ws-exception-filter';

// @UseGuards(WsAuthGuard)
@UseFilters(new WsExceptionFilter())
@UsePipes(new WSValidationPipe())
@WebSocketGateway({
  cors: {
    origin: [process.env.FRONTEND_URL!, process.env.FRONTEND_URL_NO_PORT!],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService, // ... Other services
    private readonly socketService: SocketService, // ... Other services
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    let userId = (client.request as any)?.session?.passport?.user?.id;
    if (!userId) {
      userId = client.handshake.query.userId as string;
    }
    if (!userId)
      client.disconnect();

    // THIS IS THE VALIDATION CHECK FOR THE ACCESSING USER
    // const validUser = this.socketService.getValidUser(client);

    // if (!validUser) {
    //   console.log('Emitting error and disconnecting'); // Check if this block is executed
    //   client.emit('error', 'Not authenticated');
    //   client.disconnect();
    //   return;
    // }

    const rooms = await this.chatService.handleUserConnection(+userId);
    rooms.forEach((room) => client.join(room));
  }

  @SubscribeMessage('send-channel-message')
  async handleChannelMessage(
    @MessageBody() channelMessageDto: CreateChannelMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = await this.chatService.getUserIdFromSocket(client.id);

    // Get notifications and messages to send from the service
    const chatEvents = await this.chatService.handleChannelMessage(
      userId,
      channelMessageDto,
    );

    // Emit the messages and notifications
    for (const chatEvent of chatEvents) {
      const receiverId = chatEvent.receiverId;
      const isBlocked = await this.chatService.userIsBlocked(
        receiverId,
        userId,
      );

      if (!isBlocked) {
        const memberSocketIds = await this.chatService.getSocketIdsFromUserId(
          receiverId,
        );

        memberSocketIds.forEach((socketId) => {
          if (userId == receiverId) {
            // If the sender is the receiver (message to self), emit directly to the client.
            client.emit(chatEvent.event, chatEvent.message);
          } else {
            // Otherwise, emit to the recipient's socket.
            client.to(socketId).emit(chatEvent.event, chatEvent.message);
            client
              .to(socketId)
              .emit('chat-notifications', chatEvent.notification);
          }
        });
      } else {
        // Optionally handle the case where the user is blocked, e.g., notify the sender.
        console.log(
          `Message not sent. User ${userId} is blocked by User ${receiverId}.`,
        );
      }
    }
  }

  @SubscribeMessage('send-user-message')
  async handleUserMessage(
    @MessageBody() userMessageDto: CreateUserMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = await this.chatService.getUserIdFromSocket(client.id);

    const chatEvents = await this.chatService.handleUserMessage(
      userId,
      userMessageDto,
    );

    const privateChatId = [userId, userMessageDto.receiverId].sort().join('_');
    if (!client.rooms.has(privateChatId)) client.join(privateChatId);
    const receivingSockets = await this.chatService.getSocketIdsFromUserId(
      userMessageDto.receiverId,
    );
    receivingSockets.forEach((socketId) => {
      const receivingSocket = this.server.sockets.sockets.get(socketId);
      if (receivingSocket && !receivingSocket.rooms.has(privateChatId)) {
        receivingSocket.join(privateChatId);
      }
    });

    const isBlocked = await this.chatService.userIsBlocked(
      userMessageDto.receiverId,
      userId,
    );

    if (!isBlocked) {
      client.to(privateChatId).emit(`user-msg-${userId}`, chatEvents.message);
      client
        .to(privateChatId)
        .emit('chat-notifications', chatEvents.notification);
    }
    client.emit(`user-msg-${userMessageDto.receiverId}`, chatEvents.message);
  }

  // @SubscribeMessage('get-my-channels')
  // async handleGetMyChannels(@ConnectedSocket() client: Socket): Promise<void> {
  //   const userId = await this.socketService.getUserId(client.id);
  //   const userChannels = await this.channelService.getUserChannels(userId);
  //   client.emit('my-channels', userChannels);
  // }

  // @SubscribeMessage('get-visible-channels')
  // async handleGetVisibleChannels(
  //   @ConnectedSocket() client: Socket,
  // ): Promise<void> {
  //   const userId = await this.socketService.getUserId(client.id);
  //   const nonMemberChannels = await this.channelService.getNonMemberChannels(
  //     userId,
  //   );
  //   client.emit('visible-channels', nonMemberChannels);
  // }
}
