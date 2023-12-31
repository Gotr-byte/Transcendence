import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { SocketService } from 'src/socket/socket.service';
import { UserService } from 'src/user/user.service'
import { User } from '@prisma/client';
import { GameInstance } from './GameInstance';
import { GameState } from './GameState';
import * as config from './config.json';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsExceptionFilter } from 'src/filters/ws-exception-filter';
import { WsAuthGuard } from 'src/auth/guards/socket-guards';


@UseFilters(new WsExceptionFilter())
@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: { origin: [process.env.FRONTEND_URL!, process.env.FRONTEND_URL_NO_PORT!],
  },
})
export class GameGateway implements OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;
  constructor(
    private readonly gameService: GameService,
    private readonly socketService: SocketService,
    private readonly userService: UserService,
  ) {}

  //wait only mmTimeout milliseconds for matching partner
  afterInit()
  {
    setInterval( () => {
      this.gameService.timoutQueue();
    }, 1000);
  }

  @SubscribeMessage('match-random')
  async handleStartRandomMatchmaking(
    @MessageBody() game: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> 
  {
    let fromGameQueue = this.gameService.look4match(client, null, game != 'extended');
    if (!fromGameQueue)
      return;
    if (game == 'extended')
        this.gameService.initExtendedGame(fromGameQueue.socket.id, client.id);
    else
        this.gameService.initBasicGame(fromGameQueue.socket.id, client.id);
    this.gameService.startGame(fromGameQueue.socket, client);
    this.gameService.removeFromGameQueue(fromGameQueue.socket.id);
  }
 
  @SubscribeMessage('abort-matchmaking')
  async handleAbortMatchmaking(@ConnectedSocket() client: Socket,): Promise<void>
  {
    this.gameService.removeFromGameQueue(client.id);
  }
 
  @SubscribeMessage('acceptGameRequest')
  async handleAcceptedGameRequest(
    @MessageBody() data: any,
    @ConnectedSocket() player2: Socket
    ): Promise<void>
  {
    console.log('Backend:' + JSON.stringify(data));
    if (!data.playerOneId)
    {
      player2.emit('matchmaking', 'error in response format');
      return;
    }
    let gameQueue = this.gameService.takeFromGameQueue(data.playerOneId);
    if (gameQueue == null)
    {
      player2.emit('matchmaking', 'error, maybe request already expired');
      return;
    }
    if (gameQueue.isBasic)
    {
      player2.emit('matchmaking', 'basic game');
      gameQueue.socket.emit('matchmaking', 'basic game');
       this.gameService.initBasicGame(gameQueue.socket.id, player2.id);
    }
   else
   {
      player2.emit('matchmaking', 'extended game');
      gameQueue.socket.emit('matchmaking', 'extended game');
      this.gameService.initExtendedGame(gameQueue.socket.id, player2.id);
   }
   this.gameService.startGame(gameQueue.socket, player2);
  }

  @SubscribeMessage('matchThisUser')
  async handleMatchThisSpecificUser(
    @MessageBody() data: any, 
    @ConnectedSocket() client: Socket
    ): Promise<void>
  {
    let user:   User;
    let sender: User;
    let name = data.name;
    let game = data.game || 'basic';

    if (this.gameService.isInGameQueue(client.id))
    {
      client.emit('matchmaking', 'error: already requesting');
      return;
    }
    if (!name || name.length == 0)
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
    const receivingSockIds = this.socketService.getSocketIds(
      user.id,
    );
    const receivingSocket = this.server.sockets.sockets.get(receivingSockIds[0]);
    if (!receivingSocket)
    {
      client.emit('matchmaking', 'error: not online');
      return;
    }
    sender = await this.userService.getUserById(this.socketService.getUserId(client.id));
    receivingSocket.emit("GameRequest", 
      {
        "playerOneId": client.id,
        "playeroneName": sender.username,
        "playerTwoId": receivingSocket.id,
        "playerTwoName": user.username,
        "timeStamp": tstamp,
        "gameType": game
      });

    client.emit('matchmaking', 'Success: game request pending');
    this.gameService.look4match(client, name, game != 'extended');
  }

  handleDisconnect(@ConnectedSocket() client: Socket)  
  {
    this.gameService.handleDisconnect(client);
    this.gameService.timoutQueue();
  }
}
