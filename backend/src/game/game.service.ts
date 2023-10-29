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

		this.GameLobby.set(player1Id +":"+ player2Id, new GameState(new GameInstance));
	}

	public startGame(player1: Socket, player2: Socket): void
	{
		let gameState = this.getGameState(player1, player2);
		if (!gameState || player1 == player2)
			return;
		setInterval( () => {
			player1.on("keypress", (key) => {
				if (key == 'ArrowUp')
					gameState?.setPaddleDirection(1, -1);
				else
					gameState?.setPaddleDirection(1, 1);
			});
			player2.on("keypress", (key) => {
				if (key == 'ArrowUp')
					gameState?.setPaddleDirection(2, -1);
				else
					gameState?.setPaddleDirection(2, 1);
			});

			gameState?.calcNewPosition();
			if (gameState?.getGameInstance().isFinished())
			{
				player1.emit('GameLoop', "GameOver");
				player2.emit('GameLoop', "GameOver");
				return;
			}

			player1.emit('GameLoop', 
			{
				'score1': gameState?.getGameInstance().getScore1(),
				'score2': gameState?.getGameInstance().getScore2(),
				'paddle1': gameState?.paddle1.position,
				'paddle2': gameState?.paddle2.position,
				'ball': gameState?.ball,
				'ball2': gameState?.ball2,
				'fox': gameState?.fox,
				'triggerables': gameState?.triggers,
			});
			player2.emit('GameLoop', 
			{
				'score1': gameState?.getGameInstance().getScore1(),
				'score2': gameState?.getGameInstance().getScore2(),
				'paddle1': gameState?.paddle1.position,
				'paddle2': gameState?.paddle2.position,
				'ball': gameState?.ball.position,
				'ball2': gameState?.ball2.position,
				'fox': gameState?.fox,
				'triggerables': gameState?.triggers,
			});
		}, 1000 / config.fps);
	}
}