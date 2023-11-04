import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { UserService } from 'src/user/user.service'
import { GameInstance } from './GameInstance';
import { GameState } from './GameState';
import * as config from './config.json';
import { MatchesService } from 'src/matches/matches.service';

@Injectable()
export class GameService 
{
	private GameLobby: Map<string, GameState>;

	constructor(
	private readonly socketService: SocketService,
	private readonly userService: UserService,
	private readonly matchService: MatchesService,
	) {this.GameLobby = new Map<string, GameState>;}

	private getGameState(player1Id: string, player2Id: string): GameState | undefined
	{
		return this.GameLobby.get(player1Id + ":" +player2Id);
	}

	public initGame(player1Id: string, player2Id: string): void
	{
		this.GameLobby.set(player1Id + ":" + player2Id, new GameState(new GameInstance));
	}

	private deleteGame(player1Id: string, player2Id: string): void
	{
		this.GameLobby.delete(player1Id +":"+ player2Id);;
	}

	public endGame(player1: Socket, player2: Socket): void
	{
		const gameInstance = this.getGameState(player1.id, player2.id)?.getGameInstance();
		const player1Id = this.socketService.getUserId(player1.id);
		const player2Id = this.socketService.getUserId(player2.id);
		const result = gameInstance!.getResult();

		const winnerId = result.homeScore < result.awayScore ? player2Id : player1Id;

		const matchData = { ...result, homePlayerId: player1Id, awayPlayerId: player2Id, winnerId}
		this.matchService.createMatch(matchData);
		this.deleteGame(player1.id, player2.id);
	}

	public startGame(player1: Socket, player2: Socket): void
	{
		let gameState = this.getGameState(player1.id, player2.id);
		if (!gameState || player1 == player2)
			return;
		const gameIntervall = setInterval( () => {
			player1.on("keypress", (key) => {
				if (key === "ARROWUP" || key === "ARROWUP+SPACE" || key === "ARROWDOWN" || key === "ARROWDOWN+SPACE")
					console.log("keypress1: " + key);
				if (key === "ARROWUP" || key === "ARROWUP+SPACE") //(key == 'ArrowUp')
					gameState?.setPaddleDirection(1, -1);
				else if (key === "ARROWDOWN" || key === "ARROWDOWN+SPACE")
					gameState?.setPaddleDirection(1, 1);
			});
			player2.on("keypress", (key) => {
				if (key === "ARROWUP" || key === "ARROWUP+SPACE" || key === "ARROWDOWN" || key === "ARROWDOWN+SPACE")
					console.log("keypress2: " + key);
				if (key === "ARROWUP" || key === "ARROWUP+SPACE") //(key == 'ArrowUp')
					gameState?.setPaddleDirection(2, -1);
				else if (key === "ARROWDOWN" || key === "ARROWDOWN+SPACE")
					gameState?.setPaddleDirection(2, 1);
			});

			gameState?.calcNewPosition();
			if (gameState?.getGameInstance().isFinished())
			{
				player1.emit('GameLoop', "GameOver");
				player2.emit('GameLoop', "GameOver");
				this.endGame(player1, player2);
				clearInterval(gameIntervall);
				return;
			}
			if (gameState?.getGameInstance().isInterrupted())
			{
				player1.emit('GameLoop', "OpponentDisconnected");
				player2.emit('GameLoop', "OpponentDisconnected");
				clearInterval(gameIntervall);
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
					'isUnlocked': gameState?.fox.isUnlocked,
					'isEvil': gameState?.fox.isEvil,
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

	private setDisconnectedResult(leavingPlayer: string, key: string) {
		let winnerId: number;

		const players = key.split(':');
		const result = this.getGameState(players[0], players[1])?.getGameInstance().getResult()
		if (result) {
			const homePlayerId = this.socketService.getUserId(players[0]);
			const awayPlayerId = this.socketService.getUserId(players[1]);

			if (players[0] === leavingPlayer) {
				result.homeScore = 0;
				result.awayScore = 3;
				winnerId = awayPlayerId;
			} else {
				result.homeScore = 3;
				result.awayScore = 0;
				winnerId = homePlayerId;
			}

			const matchData = { ...result, homePlayerId, awayPlayerId, winnerId}
			this.matchService.createMatch(matchData);
		}
	}

	public handleDisconnect(client: Socket) {
		const userId = client.id;
		let gameKeyToRemove: string | null = null;

		// Loop through the GameLobby to find if the disconnecting user is in a game
		this.GameLobby.forEach((gameState, key) => {
			const players = key.split(':');
			if (players.includes(userId)) {
				// Found the game the user is in
				this.getGameState(players[0], players[1])?.getGameInstance().setInterrupted();
				gameKeyToRemove = key;
				this.setDisconnectedResult(userId, key);
				this.GameLobby.delete(gameKeyToRemove);
				return;
			}
		});
		return;
	}
}