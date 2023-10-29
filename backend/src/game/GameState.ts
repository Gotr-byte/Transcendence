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
import * as config from './config.json';

export class Coordinate {
	constructor(
		public x: number,
		public y: number
	) {}
}

export class Fox {
	public isUnlocked:	boolean = false;
	public isEvil:		boolean = false;
	public isEnraged:	boolean = false;

	constructor(
		public position:	Coordinate
	) {}
}

export class Paddle {
	public direction: 	number = 0;
	public isImmobile:	boolean = false;
	constructor(
		public position: Coordinate,
		public height: number
	) {}
}

export class Triggerables
{
	public triggeredGnome:		boolean = false;
	public triggeredHarkinian:	boolean = false;
	public triggeredPopup:		boolean = false;
}

export class Ball 
{
	public position: Coordinate = new Coordinate(config.game_canvas.width / 2, config.game_canvas.height / 2);
	public radius: number = config.ball.radius;
	public velocity: number;

	constructor(
		public direction: Coordinate,
		public isUnlocked: boolean,
		public readonly start_velocity: number) 
		{
			this.velocity = start_velocity;
		}
}

export class GameState 
{
	public paddle1:		Paddle;
	public paddle2:		Paddle;
	public ball:		Ball;
	public ball2:		Ball;
	public fox: 		Fox;
	public triggers:	Triggerables;
	public winner:		number;

	constructor(
		private instance: GameInstance)
   {
		let paddle_height: number = config.paddle.height;
		this.paddle1 = new Paddle(new Coordinate(config.paddle.buffer, config.game_canvas.height / 2), paddle_height);
		this.paddle2 = new Paddle(new Coordinate(config.game_canvas.width - config.paddle.buffer - config.paddle.width, config.game_canvas.height / 2), paddle_height);
		this.ball = new Ball(this.calcRandomDirection(1), true, config.ball.velocity);
		this.ball2 = new Ball(this.calcRandomDirection(1), false, config.ball.velocity);
		this.fox = new Fox(this.calcRandomDirection(1));
		this.winner = 0;
	}

	public getGameInstance(): GameInstance
	{
		return this.instance;
	}

	public calcRandomDirection(round: number) : Coordinate {
		let x: number = (round % 2 === 1) ? 1 : -1;
		let y: number = (Math.random() * 2) - 1;
		return new Coordinate(x, y);
	}

	public calcNewPosition() : void {
		if (!this.instance.isStarted() && this.instance.getTimeDiff() > config.startTime)
			this.instance.startGame();
		if (this.instance.isFinished() || !this.instance.isStarted())
			return;
		if (this.instance.hasScored())
		{
			this.resetGameState();
			if (Math.random() * 100 < 50.0)
				this.ball2.isUnlocked = true;
			else
				this.ball2.isUnlocked = false;
			this.instance.addRound();
			this.winner = this.instance.whoWon();
			if (this.winner)
				this.instance.finishGame();
			return;
		}
		this.ball = this.calcBallPosition(this.ball);
		if (this.ball2.isUnlocked)
			this.ball2 = this.calcBallPosition(this.ball2);
		this.calcPaddlePosition(this.paddle1);
		this.calcPaddlePosition(this.paddle2);
	}

	public calcBallPosition(ball: Ball) : Ball {
		let ball_new_x: number = ball.position.x + Math.round(ball.velocity * ball.direction.x);
		let ball_new_y: number = ball.position.y + Math.round(ball.velocity * ball.direction.y);

		if (ball_new_y - ball.radius <= 0) {
			ball_new_y = ball.radius;
			ball.direction.y *= -1;
		} else if (ball_new_y + ball.radius >= config.game_canvas.height) {
			ball_new_y = config.game_canvas.height - ball.radius;
			ball.direction.y *= -1;
		}
		if ((ball_new_x - ball.radius) <= (config.paddle.buffer + config.paddle.width)) {
			if ((((ball_new_y - ball.radius) > (this.paddle1.position.y + this.paddle1.height)) ||
				((ball_new_y + ball.radius) < this.paddle1.position.y)) &&
				(!this.instance.hasScored())) {
					this.instance.scoreP2();
					this.instance.setScored();
			} else {
				ball_new_x = this.paddle1.position.x + config.paddle.width + ball.radius;
				ball.direction.y = (ball_new_y - (this.paddle1.position.y + (this.paddle1.height / 2))) / (config.paddle.height / 4);
				ball.direction.x *= -1;
			}
		} else if (ball_new_x + ball.radius >= (config.game_canvas.width - config.paddle.buffer - config.paddle.width)) {
			if (((((ball_new_y - ball.radius) > (this.paddle2.position.y + this.paddle1.height)) ||
				(ball_new_y + ball.radius) < this.paddle2.position.y)) &&
				(!this.instance.hasScored())) {
					this.instance.scoreP1();
					this.instance.setScored();
			} else {
				ball_new_x = this.paddle2.position.x - ball.radius;
				ball.direction.y = (ball_new_y - (this.paddle2.position.y + (this.paddle2.height / 2))) / (config.paddle.height / 4);
				ball.direction.x *= -1;
			}
		}
		ball.position.x = ball_new_x;
		ball.position.y = ball_new_y;
		return ball;
	}

	public calcPaddlePosition(paddle: Paddle) : void {
		if (paddle.isImmobile)
			return;
		if (paddle.position.y + (paddle.direction * config.paddle.velocity) <= 0) {
			paddle.position.y = 0;
		} else if ((paddle.position.y + paddle.height + (paddle.direction * config.paddle.velocity)) >= config.game_canvas.height) {
			paddle.position.y = config.game_canvas.height - paddle.height;
		} else {
			paddle.position.y += paddle.direction * config.paddle.velocity;
		}
	}

	public setPaddleDirection(id: number, direction: number) : void {
		let paddle: Paddle;
		if (id === 1) {
			paddle = this.paddle1;
		} else {
			paddle = this.paddle2;
		}
		paddle.direction = direction;
	}

	public resetGameState() : void {
		this.instance.notScored();
		this.ball.position.x = config.game_canvas.width / 2;
		this.ball.position.y = config.game_canvas.height / 2;
		this.ball.direction = this.calcRandomDirection(this.instance.getRound());
			this.ball2.position.x = config.game_canvas.width / 2;
			this.ball2.position.y = config.game_canvas.height / 2;
			this.ball2.direction = this.calcRandomDirection(this.instance.getRound());

		//make the game faster each round
		this.ball.velocity = config.ball.velocity + (this.instance.getRound() / 2);

		this.paddle1.position.y = (config.game_canvas.height - this.paddle1.height) / 2;
		this.paddle2.position.y = (config.game_canvas.height - this.paddle2.height) / 2;
	}
}