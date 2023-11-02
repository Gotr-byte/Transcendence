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
import { MatchesService } from 'src/matches/matches.service';
import { CreateMatchDto } from 'src/matches/dto/matchDto';
import { max } from 'rxjs';

@Injectable()
export class GameService 
{
	private GameLobby: Map<string, GameState>;

	constructor(
	private readonly socketService: SocketService,
	private readonly userService: UserService,
	private readonly matchService: MatchesService,
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

	public endGame(player1: Socket, player2: Socket, gameInstance: GameInstance): void
	{
		const player1Id = this.socketService.getUserId(player1.id);
		const player2Id = this.socketService.getUserId(player2.id);

		const result = gameInstance.getResult();

		const winnerId = result.homeScore < result.awayScore ? player2Id : player1Id;

		const matchData = { ...result, homePlayerId: player1Id, awayPlayerId: player2Id, winnerId}
		this.matchService.createMatch(matchData)
		console.log(matchData);
		
		player1.disconnect();
		player2.disconnect();
		//this.GameLobby.delete(player1Id +":"+ player2Id);
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
				this.endGame(player1, player2, gameState?.getGameInstance());
				return;
			}

			player1.emit('GameLoop', 
			{
				'score1': gameState?.getGameInstance().getScore1(),
				'score2': gameState?.getGameInstance().getScore2(),
				'paddle1': gameState?.paddle1.position,
				'paddle2': gameState?.paddle2.position,
				'ball': gameState?.ball.position,
				'ball2': gameState?.ball2.position,
				'ball2lock': gameState?.ball2.isUnlocked,
				'fox': {
					'isunlocked': gameState?.fox.isUnlocked,
					'isevil': gameState?.fox.isEvil,
					'isEnraged': gameState?.fox.isEnraged,
					'hasSizeOf': gameState?.fox.hasSizeOf,
					'pos': gameState?.fox.position
				}
			});
			player2.emit('GameLoop', 
			{
				'score1': gameState?.getGameInstance().getScore1(),
				'score2': gameState?.getGameInstance().getScore2(),
				'paddle1': gameState?.paddle1.position,
				'paddle2': gameState?.paddle2.position,
				'ball': gameState?.ball.position,
				'ball2': gameState?.ball2.position,
				'ball2lock': gameState?.ball2.isUnlocked,
				'fox': {
					'isUnlocked': gameState?.fox.isUnlocked,
					'isEvil': gameState?.fox.isEvil,
					'isEnraged': gameState?.fox.isEnraged,
					'hasSizeOf': gameState?.fox.hasSizeOf,
					'pos': gameState?.fox.position
				}
			});
		}, 1000 / config.fps);

	}
}