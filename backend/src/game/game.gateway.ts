import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
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

@WebSocketGateway({
  cors: { origin: [process.env.FRONTEND_URL!, process.env.FRONTEND_URL_NO_PORT!],
  },
})
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(
    private readonly gameService: GameService,
    private readonly socketService: SocketService,
    private readonly userService: UserService,
  ) {}

  //wait only 1 minute for matching partner
  async resetWaitingUser(): Promise<void>
  {
    setInterval( () => {
      console.log("TimeoutQueue");
      this.gameService.timoutQueue();
    }, 500);
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
    if (!data.playerOneId)
    {
      player2.emit('matchmaking', 'error in response format');
      return;
    }
    let gameQueue = this.gameService.takeFromGameQueue(data.player1Id);
    if (gameQueue == null)
    {
      player2.emit('matchmaking', 'error, maybe request already expired');
      return;
    }
    if (gameQueue.isBasic)
       this.gameService.initBasicGame(gameQueue.socket.id, player2.id);
   else
       this.gameService.initExtendedGame(gameQueue.socket.id, player2.id);
   this.gameService.startGame(gameQueue.socket, player2);
  }


  @SubscribeMessage('matchThisUser')
  async handleMatchThisSpecificUser(
    @MessageBody() name: string,
    @MessageBody() game: string,
    @ConnectedSocket() client: Socket
    ): Promise<void>
  {
    let user:User;
    let sender:User;

    if (this.gameService.isInGameQueue(client.id))
    {
      client.emit('matchmaking', 'error: already requesting');
      return;
    }
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
        "playerOneId": sender.id,
        "playeroneName": sender.username,
        "playerTwoId": user.id,
        "playerTwoName": user.username,
        "timeStamp": tstamp
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
