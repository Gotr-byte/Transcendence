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
import { GameConfig } from './game.config';
import { UserService } from 'src/user/user.service'
import { User } from '@prisma/client';
import { GameInstance } from './GameInstance';
import * as config from './config.json';

export class Coordinates
{
	constructor
	(
		public x: number,
		public y: number
	) {}
}

export class Paddle
{
	public direction: number = 0;
	constructor
	(
		public position: Coordinates,
		public height: number
	) {}
}

export class Ball 
{
	public position: Coordinates = new Coordinates(config.game_canvas.width / 2, config.game_canvas.height / 2);
	public radius: number = config.ball.radius;
	public velocity: number;

	constructor
	(
		public direction: Coordinates,
		public readonly start_velocity: number
	)
	{
		this.velocity = start_velocity;
	}
}

export class GameState 
{
	public paddle1: Paddle;
	public paddle2: Paddle;
	public ball1: Ball;

	constructor
	(
		private instance: GameInstance,
		round: number
	)
	{
		let paddle_height: number = config.paddle.height;
		this.paddle1 = new Paddle(new Coordinates(config.paddle.buffer, config.game_canvas.height / 2), paddle_height);
		this.paddle2 = new Paddle(new Coordinates(config.game_canvas.width - config.paddle.buffer - config.paddle.width, config.game_canvas.height / 2), paddle_height);
		this.ball1 = new Ball(this.calcRandomDirection(round), config.ball.velocity);
	}

	public getGameInstance(): GameInstance
	{
		return this.instance;
	}

	public calcRandomDirection(round: number): Coordinates
	{
		let x: number = (round % 2 === 1) ? 1 : -1;
		let y: number = (round % 2 === 1) ? 1 : -1;
		// let y: number = (Math.random() * 2) - 1;
		return new Coordinates(x, y);
	}

	public calcNewState(): void
	{
		this.calcBallPosition();
		this.calcPaddlePosition(this.paddle1);
		this.calcPaddlePosition(this.paddle2);
	}

	public calcBallPosition(): void
	{
		let ball_new_x: number = this.ball1.position.x + Math.round(this.ball1.velocity * this.ball1.direction.x);
		let ball_new_y: number = this.ball1.position.y + Math.round(this.ball1.velocity * this.ball1.direction.y);

		// if (Collisions.collision_ball1_paddle1 != 0 || Collisions.collision_ball1_paddle2 != 0)
		// {
		// 	this.ball1.direction.y = -this.ball1.direction.y;
		// 	this.ball1.position.y = this.ball1.position.y + this.ball1.velocity;
		// }
		// else
		if (ball_new_x <= 0 || ball_new_x >= config.game_canvas.width)
		{
			this.ball1.direction.x = -this.ball1.direction.x;
			this.ball1.position.x = this.ball1.position.x + this.ball1.velocity;
		}
		else if ((ball_new_y <= 0 + this.ball1.radius) || (ball_new_y >= config.game_canvas.height - this.ball1.radius))
		{
			this.ball1.position.x = config.game_canvas.width / 2;
			this.ball1.position.y = config.game_canvas.height / 2;
		}
		else
		{
			this.ball1.position.x = ball_new_x;
			this.ball1.position.y = ball_new_y;
		}

		// if (ball_new_y - this.ball1.radius <= 0) {
		// 	ball_new_y = this.ball1.radius;
		// 	this.ball1.direction.y *= -1;
		// } else if (ball_new_y + this.ball1.radius >= config.game_canvas.height) {
		// 	ball_new_y = config.game_canvas.height - this.ball1.radius;
		// 	this.ball1.direction.y *= -1;
		// }
		// if ((ball_new_x - this.ball1.radius) <= (config.paddle.buffer + config.paddle.width)) {
		// 	if (((ball_new_y - this.ball1.radius) > (this.paddle1.position.y + this.paddle1.height)) || ((ball_new_y + this.ball1.radius) < this.paddle1.position.y)) {
		// 		this.instance.scoreP2();
		// 		this.instance.setScored();
		// 	} else {
		// 		ball_new_x = this.paddle1.position.x + config.paddle.width + this.ball1.radius;
		// 		this.ball1.direction.y = (ball_new_y - (this.paddle1.position.y + (this.paddle1.height / 2))) / (config.paddle.height / 4);
		// 		this.ball1.direction.x *= -1;
		// 	}
		// } else if (ball_new_x + this.ball1.radius >= (config.game_canvas.width - config.paddle.buffer - config.paddle.width)) {
		// 	if (((ball_new_y - this.ball1.radius) > (this.paddle2.position.y + this.paddle1.height)) || ((ball_new_y + this.ball1.radius) < this.paddle2.position.y)) {
		// 		this.instance.scoreP1();
		// 		this.instance.setScored();
		// 	} else {
		// 		ball_new_x = this.paddle2.position.x - this.ball1.radius;
		// 		this.ball1.direction.y = (ball_new_y - (this.paddle2.position.y + (this.paddle2.height / 2))) / (config.paddle.height / 4);
		// 		this.ball1.direction.x *= -1;
		// 	}
		// }
		// this.ball1.position.x = ball_new_x;
		// this.ball1.position.y = ball_new_y;
	}

	public calcPaddlePosition(paddle: Paddle): void
	{
		if (paddle.position.y + (paddle.direction * config.paddle.velocity) <= 0)
		{
			paddle.position.y = 0;
		}
		else if ((paddle.position.y + paddle.height + (paddle.direction * config.paddle.velocity)) >= config.game_canvas.height)
		{
			paddle.position.y = config.game_canvas.height - paddle.height;
		}
		else
		{
			paddle.position.y += paddle.direction * config.paddle.velocity;
		}
	}

	public setPaddleDirection(id: number, direction: number): void
	{
		let paddle: Paddle;
		if (id === 1)
		{
			paddle = this.paddle1;
		}
		else
		{
			paddle = this.paddle2;
		}
		paddle.direction = direction;
	}

	public resetGameState() : void
	{
		this.ball1.position.x = config.game_canvas.width / 2;
		this.ball1.position.y = config.game_canvas.height / 2;
		this.ball1.direction = this.calcRandomDirection(this.instance.getRound());

		//make the game faster each round
		// this.ball1.velocity = config.ball.velocity + this.instance.getRound();

		this.paddle1.position.y = (config.game_canvas.height - this.paddle1.height) / 2;
		this.paddle2.position.y = (config.game_canvas.height - this.paddle2.height) / 2;
	}
}