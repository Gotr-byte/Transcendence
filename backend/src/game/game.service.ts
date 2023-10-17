import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { GameConfig } from './game.config';
import { UserService } from 'src/user/user.service'
import { User } from '@prisma/client';
import { GameInstance } from './GameInstance';
import { GameState } from './GameState';
import * as config from './config.json';

@Injectable()
export class GameService 
{
	private GameLobby: Map<string, GameState>;

	constructor(
	private readonly socketService: SocketService,
	private readonly userService: UserService,
	) {this.GameLobby = new Map<string, GameState>;}

	private getGameState(p1: Socket, p2: Socket): GameState | undefined
	{
		const p1Id = this.socketService.getUserId(p1.id);
		const p2Id = this.socketService.getUserId(p2.id);

		return this.GameLobby.get(p1Id + ":" + p2Id);

	}


	public initGame(player1: Socket, player2: Socket): void
	{
		const player1Id = this.socketService.getUserId(player1.id);
		const player2Id = this.socketService.getUserId(player2.id);

		this.GameLobby.set(player1Id +":"+ player2Id, new GameState(new GameInstance, 1));
	}

	public startGame(player1: Socket, player2: Socket): void
	{
		let gameState = this.getGameState(player1, player2);
		if (!gameState)
			return;
		setInterval( () => {
			gameState?.calcNewPosition();
			player1.emit('GameLoop', 
			{
				'paddle1': gameState?.paddle1.position,
				'paddle2': gameState?.paddle2.position,
				'ball': gameState?.ball.position,
				'score1': gameState?.getGameInstance().getScore1(),
				'score2': gameState?.getGameInstance().getScore2()
			});
			player2.emit('GameLoop', 
			{
				'paddle1': gameState?.paddle1.position,
				'paddle2': gameState?.paddle2.position,
				'ball': gameState?.ball.position,
				'score1': gameState?.getGameInstance().getScore1(),
				'score2': gameState?.getGameInstance().getScore2()
			});
		}, 1000 / config.fps);

	}
}
	