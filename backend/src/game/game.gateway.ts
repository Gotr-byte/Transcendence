import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL } })
export class GameGateway implements OnGatewayDisconnect {
  constructor(
    private readonly gameService: GameService,
    private readonly socketSerivce: SocketService,
  ) {}

  private waitingUser: Socket | null;

  @SubscribeMessage('find-match')
  async handleStartMatchmaking(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    if (this.waitingUser) {
      const opponent = this.waitingUser;
      this.waitingUser = null;
      // If there's a waiting user, match them together
      const homePlayerId = this.socketSerivce.getUserId(opponent.id);
      const awayPlayerId = this.socketSerivce.getUserId(client.id);
      client.emit('matchmaking', 'opponent found!');
      opponent.emit('matchmaking', 'opponent found!');
      // createMatch(homePlayerId, awayPlayerId);
    } else {
      client.emit('matchmaking', 'waiting for opponent...');
      this.waitingUser = client;
    }
  }

  @SubscribeMessage('abort-matchmaking')
  async handleAbortMatchmaking(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    if (this.waitingUser === client) {
      this.waitingUser = null;
      client.emit('matchmaking', 'operation aborted');
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    if (this.waitingUser === client) this.waitingUser = null;
  }
}
