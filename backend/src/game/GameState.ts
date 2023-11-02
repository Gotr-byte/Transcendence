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
	public hasSizeOf:	number = config.fox.minSize;
	public timeStamp:	number = 0;
	public paddleTime:	number = 0;
	public sticking:	number = 0;
	public velocity:	number = config.ball.velocity;

	constructor(
		public position:	Coordinate
	) { 
		this.timeStamp= Date.now();
	}
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

			// PoC, can be removed later
			if (Math.random() * 100 < 50)
				this.ball2.isUnlocked = true;
			else
				this.ball2.isUnlocked = false;
			// remove until here

			this.instance.addRound();
			this.winner = this.instance.whoWon();
			if (this.winner)
				this.instance.finishGame();
			return;
		}
		this.unlockBall();
		this.unlockFox();
		if (this.fox.isUnlocked)
		{
			this.checkFoxMood();
			this.isEnragedFox();
			this.calcFoxPosition();
			//this.unstickFoxFromPaddle();
			this.freePaddles();
			this.foxBallCollission();
		}
		this.ball = this.calcBallPosition(this.ball);
		if (this.ball2.isUnlocked)
			this.ball2 = this.calcBallPosition(this.ball2);
		this.calcPaddlePosition(this.paddle1);
		this.calcPaddlePosition(this.paddle2);
	}

	public foxBallCollission(): void
	{
		if (!this.fox.isUnlocked || !this.fox.isEnraged)
			return;
		let fsize = this.fox.hasSizeOf;
		//do collission logic here and let them bounce
	}

	public unlockBall(): void
	{
		if (this.instance.getScore1() + this.instance.getScore2() == config.unlockSecondBallAt)
			this.ball2.isUnlocked = true;
	}

	public unlockFox(): void
	{
		if (this.instance.getScore1() + this.instance.getScore2() == config.fox.showUpWhen)
		{
			this.fox.isUnlocked = true;
			this.fox.timeStamp = Date.now();
			this.fox.paddleTime = Date.now();
		}
	}

	public unstickFoxFromPaddle(): void
	{
		if (!this.fox.isUnlocked || !this.fox.isEvil)
			return;
		if ((Date.now() > this.fox.sticking + config.fox.timeStick2Paddle) || 
			(Math.random() * 1000 <= 10))
		{
			this.fox.isEvil = false;
			this.fox.timeStamp = Date.now();
			this.fox.sticking = 0;
		}
	}

	public checkFoxMood(): void
	{
		if (!this.fox.isUnlocked)
			return;
		if (Date.now() > this.fox.timeStamp + config.fox.maxTimeGoodEvil)
		{
			this.fox.timeStamp = Date.now();
			if (Math.random() * 1000 > 500)
				this.fox.isEvil = true;
			else
				this.fox.isEvil = false;
		}
	}

	public isEnragedFox(): void
	{
		if (!this.fox.isUnlocked)
			return;
		let rndTime = Math.random() * config.fox.getEnragedIn;
		if (Date.now() > this.fox.paddleTime + config.fox.getEnragedIn + rndTime)
		{
			this.fox.isEnraged = true;
			this.fox.velocity = config.fox.maxVelocity;
			this.fox.hasSizeOf = config.fox.maxSize;
		}
	}

	public unrageFox(): void
	{
		if (!this.fox.isUnlocked || !this.fox.isEnraged)
			return;
		this.fox.isEnraged = false;
		this.fox.velocity = config.fox.minVelocity;
		this.fox.hasSizeOf = config.fox.minSize;
		this.fox.isEvil = false;
		this.fox.timeStamp = Date.now();
	}

	public foxPaddleBehavior(paddle: number): void
	{
		this.unrageFox();
		if (!this.fox.isEvil)
			this.fox.paddleTime = Date.now();
		else
		{
			if (paddle == 1)
				this.paddle1.isImmobile = true;
			else
				this.paddle2.isImmobile = true;
			this.fox.velocity = 0;
			this.fox.paddleTime = Date.now() + Math.random() * config.fox.timeStick2Paddle;
		}
	}

	public freePaddles(): void
	{
		if (!this.fox.isUnlocked || this.fox.velocity > 0)
			return;
		if (this.fox.velocity == 0 && this.fox.paddleTime < Date.now())
		{
			this.fox.paddleTime = Date.now();
			this.paddle1.isImmobile = false;
			this.paddle2.isImmobile = false;
			this.fox.isEvil = false;
			this.fox.velocity = config.fox.minVelocity;
			this.fox.timeStamp = Date.now();
		}
	}

	public calcFoxPosition() : void 
	{
		let fox_new_x: number = this.fox.position.x + Math.round(this.fox.velocity * this.fox.position.x);
		let fox_new_y: number = this.fox.position.y + Math.round(this.fox.velocity * this.fox.position.y);

		if (this.fox.sticking)
			return;

		if (fox_new_y - this.fox.hasSizeOf <= 0) 
		{
			fox_new_y = this.fox.hasSizeOf;
			this.fox.position.y *= -1;
		}
		else if (fox_new_y + this.fox.hasSizeOf >= config.game_canvas.height) 
		{
			fox_new_y = config.game_canvas.height - this.fox.hasSizeOf;
			this.fox.position.y *= -1;
		}
		if (fox_new_x - this.fox.hasSizeOf <= 0) 
		{
			fox_new_x = this.fox.hasSizeOf;
			this.fox.position.x *= -1;
		}
		else if (fox_new_x + this.fox.hasSizeOf >= config.game_canvas.width) 
		{
			fox_new_x = config.game_canvas.width - this.fox.hasSizeOf;
			this.fox.position.x *= -1;
		}
		if ((fox_new_x - this.fox.hasSizeOf) <= (config.paddle.buffer + config.paddle.width)) 
		{
			if ((((fox_new_y - this.fox.hasSizeOf) > (this.paddle1.position.y + this.paddle1.height)) ||
				((fox_new_y + this.fox.hasSizeOf) < this.paddle1.position.y)))
			{
				//do nothing
			}
			else
			{
				fox_new_x = this.paddle1.position.x + config.paddle.width + this.fox.hasSizeOf;
				this.fox.position.y = (fox_new_y - (this.paddle1.position.y + (this.paddle1.height / 2))) / (config.paddle.height / 4);
				this.fox.position.x *= -1;
				this.foxPaddleBehavior(1);
			}
		}
		else if (fox_new_x + this.fox.hasSizeOf >= (config.game_canvas.width - config.paddle.buffer - config.paddle.width)) 
		{
			if (((((fox_new_y - this.fox.hasSizeOf) > (this.paddle2.position.y + this.paddle1.height)) ||
				(fox_new_y + this.fox.hasSizeOf) < this.paddle2.position.y)))
			{
				//do nothing
			}
			else
			{
				fox_new_x = this.paddle2.position.x - this.fox.hasSizeOf;
				this.fox.position.y = (fox_new_y - (this.paddle2.position.y + (this.paddle2.height / 2))) / (config.paddle.height / 4);
				this.fox.position.x *= -1;
				this.foxPaddleBehavior(2);
			}
		}
		// 1% chance if enraged to reverse x and/or y direction
		if (this.fox.isEnraged && Math.random() * 1000 <= 10)
			fox_new_x *= -1;
		if (this.fox.isEnraged && Math.random() * 1000 <= 10)
			fox_new_y *= -1;
		this.fox.position.x = fox_new_x;
		this.fox.position.y = fox_new_y;
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