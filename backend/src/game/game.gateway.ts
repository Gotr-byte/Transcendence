import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { GameConfig } from './game.config';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL } })
export class GameGateway implements OnGatewayDisconnect {
  constructor(
    private readonly gameService: GameService,
    private readonly socketService: SocketService,
  ) {}

  private waitingUser: Socket | null;
  private timestamp: number | null;

  @SubscribeMessage('match-random')
  async handleStartRandomMatchmaking(@ConnectedSocket() client: Socket,): Promise<void> 
  {
    if (this.waitingUser) 
    {
      const opponent = this.waitingUser;
      this.waitingUser = null;
      // If there's a waiting user, match them together
      const homePlayerId = this.socketService.getUserId(opponent.id);
      const awayPlayerId = this.socketService.getUserId(client.id);
      client.emit('matchmaking', 'opponent found!');
      opponent.emit('matchmaking', 'opponent found!');
      // createMatch(homePlayerId, awayPlayerId);
    }
    else
    {
      this.timestamp = Date.now();
      client.emit('matchmaking', 'waiting for opponent...' + GameConfig.matchTimeout);
      this.waitingUser = client;
    }
  }
  
  @SubscribeMessage('abort-matchmaking')
  async handleAbortMatchmaking(@ConnectedSocket() client: Socket,): Promise<void>
  {
    if (this.waitingUser === client)
    {
      this.waitingUser = null;
      client.emit('matchmaking', 'operation aborted');
    }
  }

  @SubscribeMessage('timeout-matchmaking')
  async handleTimeoutMatchmaking(@ConnectedSocket() client: Socket,): Promise<void>
  {
    if (!this.timestamp)
      return;
    const diff = Math.floor((Date.now() - this.timestamp) / 1000)
    if (this.waitingUser === client && diff > GameConfig.matchTimeout)
    {
      this.waitingUser = null;
      client.emit('matchmaking', 'operation timed out');
    }
  }

  
  handleDisconnect(@ConnectedSocket() client: Socket) {
    if (this.waitingUser === client) this.waitingUser = null;
  }
}
