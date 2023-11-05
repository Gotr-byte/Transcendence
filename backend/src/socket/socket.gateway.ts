import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/guards/socket-guards';
import { WsExceptionFilter } from 'src/filters/ws-exception-filter';


declare module "socket.io" {
  interface Socket {
    shouldHandleDisconnect?: boolean;
  }
}

@UseFilters(new WsExceptionFilter())
// @UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: {
    origin: [process.env.FRONTEND_URL!, process.env.FRONTEND_URL_NO_PORT!],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly socketService: SocketService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    let userId = (client.request as any)?.session?.passport?.user?.id;
    if (!userId) {
      userId = client.handshake.query.userId as string;
    }
    if (!userId) {
      client.shouldHandleDisconnect = false
      client.disconnect();
      return;
    }

    // THIS IS THE VALIDATION CHECK FOR THE ACCESSING USER
    // const validUser = this.socketService.getValidUser(client);

    // if (!validUser) {
    //   console.log('Emitting error and disconnecting'); // Check if this block is executed
    //   client.emit('error', 'Not authenticated');
    //   client.disconnect();
    //   return;
    // }

    this.socketService.registerOnlineUser(+userId, client);
    console.info(`Client connected with ID: ${client.id}`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    if (client.shouldHandleDisconnect === false)
      return;
    await this.socketService.disconnectUser(client.id);
    console.info(`Client disconnected with ID: ${client.id}`);
  }
}
// export class SocketGateway implements OnModuleInit {
//   @WebSocketServer() server: Server;
//   onModuleInit() {
//     this.server.on('connect', (socket) => {
//       console.log(socket.id);
//       console.log('Connected');
//     });
//   }

//   @SubscribeMessage('newMessage')
//   onNewMessage(@MessageBody() body: any) {
//     console.log(body);
//     this.server.emit('onMessage', {
//       msg: 'new Message',
//       content: body,
//     });
//   }
// }
