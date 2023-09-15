import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { UseGuards } from '@nestjs/common';
import { SocketSessionGuard } from 'src/auth/guards/socket-guards';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: 'GET, POST, PATCH, DELETE',
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private socketService: SocketService) {}

  @UseGuards(SocketSessionGuard)
  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(client.handshake);
    const userId = client.handshake.query.userId as string;
    this.socketService.registerOnlineUser(+userId, client.id);
    console.info(`Client connected with ID: ${client.id}`);
    // Any additional logic when a user connects can be added here.
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    await this.socketService.disconnectUser(client.id);
    console.info(`Client disconnected with ID: ${client.id}`);
    // Any additional logic when a user disconnects can be added here.
  }
}
