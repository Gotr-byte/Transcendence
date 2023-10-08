import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { GameConfig } from './game.config';
import { UserService } from 'src/user/user.service'
import { User } from '@prisma/client';
import {
  ChangeUserDto,
  ChangeUserPropsDto,
  ShowAnyUserDto,
  ShowLoggedUserDto,
  ShowUsersDto,
} from 'src/user/dto';
import { UserDetails } from 'src/user/types';
import { InviteUserDto } from './dto/InviteUserDto';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL } })
export class GameGateway implements OnGatewayDisconnect {
  constructor(
    private readonly gameService: GameService,
    private readonly socketService: SocketService,
    private readonly userService: UserService,
  ) {}

  private waitingUser: Socket | null;
  private timestamp: number | null;
  private user: User;

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

  @SubscribeMessage('matchThisUser')
  async handleMatchThisSpecificUser(
    @MessageBody() name: InviteUserDto,
    @ConnectedSocket() client: Socket
    ): Promise<void>
  {
    var user:User;

    if (name == null || name.length == 0)
    {
      client.emit('matchmaking', 'error: no name given');
      return;
    }
    try
    {
      user = await this.userService.getUserByName(name);
    }
    catch (e)
    {
      client.emit('matchmaking', 'user unknown');
      return;
    }
    if (!user.isOnline || user.inGame)
    {
      client.emit('matchmaking', 'error: not online or in game already');
      return;
    }
    const tstamp = Date.now();
    //wait for configured amount of time until match confirms
    //set both inGame to true and start the game
    client.emit('matchmaking', 'Success: matched with ' + name);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    if (this.waitingUser === client) this.waitingUser = null;
  }
}
