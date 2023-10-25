import React, { useRef, useEffect, useState, useContext } from 'react';
import { WebsocketContext } from "../components/Context/WebsocketContexts";

import JoinRandom from '../components/Game/JoinRandom';
import ReceivedGameData from '../components/Game/ReceiveGameData';

import musicBavariaSrc from '../../public/assets/Music_Meanwhile_in_Bavaria.mp3';
import musicMushroomKingdomSrc from '../../public/assets/Music_Mushroom_Kingdom.mp3';
import musicNumberOneSrc from '../../public/assets/Music_We_Are_Number_One.mp3';
import musicStubbSrc from '../../public/assets/Music_Stubb_a_Dubb.mp3';

import videoMcrolldSrc from '../../public/assets/Video_Mcrolld.mp4';
import videoMcrolldReverseSrc from '../../public/assets/Video_Mcrolld_reverse.mp4';

import audioGnomeSrc from '../../public/assets/SoundEffect_Gnome.mp3';
import imageGnomeSrc from '../../public/assets/Image_Gnome.png';

import audioHarkinianOahSrc from '../../public/assets/SoundEffect_Harkinian_Oah.mp3';
import audioHarkinianHitSrc from '../../public/assets/SoundEffect_Harkinian_Hit.mp3';
import videoHarkinianHitSrc from '../../public/assets/Video_Harkinian_Hit.mp4';

import imageFoxBadSrc from '../../public/assets/Image_Fox_bad.png';
import imageFoxGoodSrc from '../../public/assets/Image_Fox_good.png';
import imageFoxEnragedSrc from '../../public/assets/Image_Fox_enraged_ORIGINAL.png';
import audioFoxEnrageSrc from '../../public/assets/SoundEffect_Fox_Enrage.mp3';

import audioFoxMeowSrc from '../../public/assets/SoundEffect_Fox_Meow.mp3';
import audioFoxWoofSrc from '../../public/assets/SoundEffect_Fox_Woof.mp3';
import audioFoxQuackSrc from '../../public/assets/SoundEffect_Fox_Quack.mp3';
import audioFoxChickenSrc from '../../public/assets/SoundEffect_Fox_Chicken.mp3';
import audioFoxGoatSrc from '../../public/assets/SoundEffect_Fox_Goat.mp3';
import audioFoxPigSrc from '../../public/assets/SoundEffect_Fox_Pig.mp3';
import audioFoxTweetSrc from '../../public/assets/SoundEffect_Fox_Tweet.mp3';
import audioFoxAheeSrc from '../../public/assets/SoundEffect_Fox_Ahee.mp3';
import audioFoxChaSrc from '../../public/assets/SoundEffect_Fox_Cha.mp3';
import audioFoxKakaSrc from '../../public/assets/SoundEffect_Fox_Kaka.mp3';
import audioFoxPapaSrc from '../../public/assets/SoundEffect_Fox_Papa.mp3';
import audioFoxYokSrc from '../../public/assets/SoundEffect_Fox_Yok.mp3';

interface Coordinates {
    x: number;
    y: number;
}

interface GameState {
    paddle1: Coordinates;
    paddle2: Coordinates;
    ball: Coordinates;
    score1: number;
    score2: number;
}

const Game: React.FC = () =>
{
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvasWidth: number = 1366;
	const canvasHeight: number = 768;

	const [frameRate, setFrameRate] = useState(60);
	const thenRef = useRef<number | null>(null);
	const startTimeRef = useRef<number | null>(null);

	// Game modes
			
	var classicMode: boolean = false;
			
			
			
	// Difficulties unlocked

	var	difficultyScore: number = 0;
	var	difficultyBallAndPaddle: number = 0;
	var isUnlockedRandomRGB1: boolean = false;
	var isUnlockedGnome: boolean = false;
	var isUnlockedHarkinian: boolean = false;
	var isUnlockedRandomRGB2: boolean = false;
	var isUnlockedFox: boolean = false;
	var isUnlockedVideo: boolean = false;
	var isUnlockedSecondBall: boolean = false;
	var isUnlockedPopups: boolean = false;



	// Balls and Fox

	var ballGlobalRadius: number = 15;
	var ballGlobalSpeedDefault: number = 3;
	var ballGlobalSpeedAddedPerma: number = 0;
	var ballGlobalSpeedAddedTemp: number = 0;

	var ball1X: number = canvasWidth / 2;
	var ball1Y: number = canvasHeight / 2;
	var ball1DirX: number = 1;
	var ball1DirY: number = 1;
	var ball1SpeedX: number = 1;
	var ball1SpeedY: number = 1;		

	var ball2X: number = canvasWidth / 2;
	var ball2Y: number = canvasHeight / 2;
	var ball2DirX: number = 1;
	var ball2DirY: number = 1;
	var ball2SpeedX: number = 1;
	var ball2SpeedY: number = 1;
	
	
	
	// Paddles
	
	var paddleGlobalHeight: number = 10;
	var paddleGlobalWidth: number = 75;
	var paddleGlobalReduction: number = 0;
	var paddleGlobalSpeed: number = 10;
	
	var paddleP1X: number = (canvasWidth - paddleGlobalWidth) / 2;
	var paddleP1SpeedMod: number = 0;
	var paddleP2X: number = (canvasWidth - paddleGlobalWidth) / 2;
	var paddleP2SpeedMod: number = 0;
	
	var paddleP1IsAttacked: boolean = false;
	var paddleP2IsAttacked: boolean = false;
	
	var keyLeftPressed: boolean = false;
	var keyRightPressed: boolean = false;
	var keyDownPressed: boolean = false;
	var keyAPressed: boolean = false;
	var keyDPressed: boolean = false;
	var keySPressed: boolean = false;
	
	
	
	// Colors
	
	var colorCodeRGBBackground: string = "000000"
	var colorCodeRGBScore: string = "FFFFFF"
	var colorCodeRGBBall1: string = "0095DD"
	var colorCodeRGBBall2: string = "0095DD"
	var colorCodeRGBP1: string = "0095DD"
	var colorCodeRGBP2: string = "0095DD"
	
	
	
	// Gnome
	
	var gnomeIsActive: boolean = false;
	var gnomeStartTime: any = null;
	
	
	
	// King Harkinian
	
	var harkinianIsActive = false;
	var harkinianX = canvasWidth / 2;
	var harkinianY = canvasHeight / 2;
	var harkinianWidth = 200;
	var harkinianHeight = 150;
	
	
	
	// Fox
	
	var foxPosX: number = canvasWidth / 2;
	var foxPosY: number = canvasHeight / 2;
	var foxDirX: number = 1;
	var foxDirY: number = 1;
	var foxSpeedDefault: number = 3;
	var foxSpeed: number = 3;
	var foxIsEvil: boolean = false;
	var foxIsEnraged: boolean = false;
	var foxIsAttacking: boolean = false;
	var foxTimestampLastAppeased: any = null;
	var foxTimeTillEnraged: number = 10000 + Math.random() * 20;
	
	
	
	// Game stats
	
	var Collisions: any = {};
	var ballPaddleBounces: number = 0;
	var scoreP1: number = 0;
	var scoreP2: number = 0;
	var whoLostBall: number = 0;
	
	
	
	// Assets
	
	// Music
	const musicBavaria = useRef<HTMLAudioElement | null>(null);
	const musicMushroomKingdom = useRef<HTMLAudioElement | null>(null);
	const musicNumberOne = useRef<HTMLAudioElement | null>(null);
	const musicStubb = useRef<HTMLAudioElement | null>(null);
	
	// Video
	const videoMcrolld = useRef<HTMLVideoElement | null>(null);
	const videoMcrolldReverse = useRef<HTMLVideoElement | null>(null);
	var mcrolldQueued: boolean = true;
	var mcrolldReverseQueued: boolean = false;
	var videoToDraw: HTMLVideoElement = videoMcrolld;

	// Gnome
	const imageGnome = useRef<HTMLImageElement>(new Image());
	imageGnome.current.src = imageGnomeSrc;
	imageGnome.current.width = 168;
	imageGnome.current.height = 171;
	const audioGnome = useRef<HTMLAudioElement | null>(null);
	
	// King Harkinian
	const audioHarkinianOah = useRef<HTMLAudioElement | null>(null);
	const audioHarkinianHit = useRef<HTMLAudioElement | null>(null);
	const videoHarkinianHit = useRef<HTMLVideoElement | null>(null);
	
	// Fox
	const imageFoxBad = useRef<HTMLImageElement>(new Image());
	imageFoxBad.current.src = imageFoxBadSrc;
	imageFoxBad.current.width = 50;
	imageFoxBad.current.height = 49;
	const imageFoxGood = useRef<HTMLImageElement>(new Image());
	imageFoxGood.current.src = imageFoxGoodSrc;
	imageFoxGood.current.width = 50;
	imageFoxGood.current.height = 49;
	const imageFoxEnraged = useRef<HTMLImageElement>(new Image());
	imageFoxEnraged.current.src = imageFoxEnragedSrc;
	imageFoxEnraged.current.width = 153;
	imageFoxEnraged.current.height = 149;
	const audioFoxEnrage = useRef<HTMLAudioElement | null>(null);
	// Good sounds
	const audioFoxMeow = useRef<HTMLAudioElement | null>(null);
	const audioFoxWoof = useRef<HTMLAudioElement | null>(null);
	const audioFoxQuack = useRef<HTMLAudioElement | null>(null);
	const audioFoxChicken = useRef<HTMLAudioElement | null>(null);
	const audioFoxGoat = useRef<HTMLAudioElement | null>(null);
	const audioFoxPig = useRef<HTMLAudioElement | null>(null);
	const audioFoxTweet = useRef<HTMLAudioElement | null>(null);
	// Evil sounds
	const audioFoxAhee = useRef<HTMLAudioElement | null>(null);
	const audioFoxCha = useRef<HTMLAudioElement | null>(null);
	const audioFoxKaka = useRef<HTMLAudioElement | null>(null);
	const audioFoxPapa = useRef<HTMLAudioElement | null>(null);
	const audioFoxYok = useRef<HTMLAudioElement | null>(null);
	
	// Set the multimedia sources when the component has rendered
	useEffect(() =>
	{
		if (audioGnome.current)
		{
			audioGnome.current.src = audioGnomeSrc;
		}
		if (audioHarkinianHit.current)
		{
			audioHarkinianHit.current.src = audioHarkinianHitSrc;
		}
		if (audioHarkinianOah.current)
		{
			audioHarkinianOah.current.src = audioHarkinianOahSrc;
		}
		if (audioFoxMeow.current)
		{
			audioFoxMeow.current.src = audioFoxMeowSrc;
		}
		if (audioFoxWoof.current)
		{
			audioFoxWoof.current.src = audioFoxWoofSrc;
		}
		if (audioFoxQuack.current)
		{
			audioFoxQuack.current.src = audioFoxQuackSrc;
		}
		if (audioFoxChicken.current)
		{
			audioFoxChicken.current.src = audioFoxChickenSrc;
		}
		if (audioFoxGoat.current)
		{
			audioFoxGoat.current.src = audioFoxGoatSrc;
		}
		if (audioFoxPig.current)
		{
			audioFoxPig.current.src = audioFoxPigSrc;
		}
		if (audioFoxTweet.current)
		{
			audioFoxTweet.current.src = audioFoxTweetSrc;
		}
		if (audioFoxAhee.current)
		{
			audioFoxAhee.current.src = audioFoxAheeSrc;
		}
		if (audioFoxCha.current)
		{
			audioFoxCha.current.src = audioFoxChaSrc;
		}
		if (audioFoxKaka.current)
		{
			audioFoxKaka.current.src = audioFoxKakaSrc;
		}
		if (audioFoxPapa.current)
		{
			audioFoxPapa.current.src = audioFoxPapaSrc;
		}
		if (audioFoxYok.current)
		{
			audioFoxYok.current.src = audioFoxYokSrc;
		}
		if (audioFoxEnrage.current)
		{
			audioFoxEnrage.current.src = audioFoxEnrageSrc;
		}
		if (videoHarkinianHit.current)
		{
			videoHarkinianHit.current.src = videoHarkinianHitSrc;
		}
		if (musicBavaria.current)
		{
			musicBavaria.current.src = musicBavariaSrc;
		}
		if (musicMushroomKingdom.current)
		{
			musicMushroomKingdom.current.src = musicMushroomKingdomSrc;
		}
		if (musicNumberOne.current)
		{
			musicNumberOne.current.src = musicNumberOneSrc;
		}
		if (musicStubb.current)
		{
			musicStubb.current.src = musicStubbSrc;
		}
		if (videoMcrolld.current)
		{
			  videoMcrolld.current.src = videoMcrolldSrc;
		}
		if (videoMcrolldReverse.current)
		{
			  videoMcrolldReverse.current.src = videoMcrolldReverseSrc;
		}
	}, []);

	function randomizeColors(): void
	{
		//if (difficultyScore >= 20)
		//{
			colorCodeRGBBackground = Math.floor(Math.random()*Math.random()*16777215/2).toString(16);
		//}
		colorCodeRGBScore = Math.floor(Math.random()*16777215/2 + 16777215/2).toString(16);
		colorCodeRGBBall1 = Math.floor(Math.random()*16777215/2 + 16777215/2).toString(16);
		colorCodeRGBBall2 = Math.floor(Math.random()*16777215/2 + 16777215/2).toString(16);
		colorCodeRGBP1 = Math.floor(Math.random()*16777215/2 + 16777215/2).toString(16);
		colorCodeRGBP2 = Math.floor(Math.random()*16777215/2 + 16777215/2).toString(16);
	}
	
	function drawBackground(ctx: CanvasRenderingContext2D): void
	{
		ctx.beginPath();
		ctx.rect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = "#" + colorCodeRGBBackground;
		ctx.fill();
		ctx.closePath();
	}
	
	function drawBalls(ctx: CanvasRenderingContext2D): void
	{
		if (gnomeIsActive === false)
		{
			ctx.beginPath();
			ctx.arc(ball1X, ball1Y, ballGlobalRadius, 0, Math.PI * 2);
			ctx.fillStyle = "#" + colorCodeRGBBall1;
			ctx.fill();
			ctx.closePath();
			
			if (isUnlockedSecondBall)
			{
				ctx.beginPath();
				ctx.arc(ball2X, ball2Y, ballGlobalRadius, 0, Math.PI * 2);
				ctx.fillStyle = "#" + colorCodeRGBBall2;
				ctx.fill();
				ctx.closePath();
			}
		}
	}
	
	function drawPaddles(ctx: CanvasRenderingContext2D): void
	{
		ctx.beginPath();
		ctx.rect(paddleP1X, canvasHeight - paddleGlobalHeight, paddleGlobalWidth - paddleGlobalReduction, paddleGlobalHeight);
		ctx.fillStyle = "#" + colorCodeRGBP1;
		ctx.fill();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.rect(paddleP2X, 0, paddleGlobalWidth - paddleGlobalReduction, paddleGlobalHeight);
		ctx.fillStyle = "#" + colorCodeRGBP2;
		ctx.fill();
		ctx.closePath();
	}
	
	function drawScore(ctx: CanvasRenderingContext2D): void
	{
		ctx.font = "16px Sherwood";
		ctx.fillStyle = "#" + colorCodeRGBScore;
		ctx.fillText(`Score P1: ${scoreP1}`, canvasWidth - 100, canvasHeight - 10);
		ctx.fillText(`Score P2: ${scoreP2}`, 8, 20);
	}
	
	function drawGnome(ctx: CanvasRenderingContext2D, timestamp: number): void
	{
		if (isUnlockedGnome)
		{
			if (gnomeIsActive === false)
			{
				if (Math.floor(Math.random()*1000) === 666)
				{
					gnomeStartTime = timestamp;
					gnomeIsActive = true;
					audioGnome.current.play();
					gnome_swap();
				}
			}
			else if (timestamp - gnomeStartTime <= 200)
			{
				ctx.drawImage(imageGnome.current, ball1X - 80, ball1Y - 90);
				if (isUnlockedSecondBall)
				{
					ctx.drawImage(imageGnome.current, ball2X - 80, ball2Y - 90);
				}
				if (isUnlockedFox)
				{
					ctx.drawImage(imageGnome.current, foxPosX - 80, foxPosY - 90);
				}
			}
			else
			{
				gnomeIsActive = false;
			}
		}
	}
	
	function drawHarkinian(ctx: CanvasRenderingContext2D): void
	{
		if (isUnlockedHarkinian)
		{
			if (harkinianIsActive === false)
			{
				if (Math.floor(Math.random()*1000) === 666)
				{
					harkinianIsActive = true;
					videoHarkinianHit.current.play();
					audioHarkinianOah.current.play();
					audioHarkinianHit.current.play();
					harkinian_hit(Math.floor(Math.random() * 100));
				}
			}
			else if (videoHarkinianHit.current.paused === false)
			{
				ctx.drawImage(videoHarkinianHit.current, harkinianX, harkinianY, harkinianWidth, harkinianHeight);
			}
			else
			{
				harkinianIsActive = false;
			}
		}
	}
	
	function drawFox(ctx: CanvasRenderingContext2D): void
	{
		if (isUnlockedFox)
		{
			if (foxIsEnraged)
			{
				ctx.drawImage(imageFoxEnraged.current, foxPosX, foxPosY);
			}
			else if (foxIsEvil)
			{
				ctx.drawImage(imageFoxBad.current, foxPosX, foxPosY);
			}
			else
			{
				ctx.drawImage(imageFoxGood.current, foxPosX, foxPosY);
			}
		}
	}
	
	function collisionCheck_ballPaddle(ballFutureX: number, ballFutureY: number): number
	{
		let collision: number = 0;
		
		// Paddle 1
		if (ballFutureY >= canvasHeight - ballGlobalRadius)
		{
			if (ballFutureX + ballGlobalRadius / 2 >= paddleP1X &&
				ballFutureX - ballGlobalRadius / 2 <= paddleP1X + paddleGlobalWidth - paddleGlobalReduction)
			{
				collision = 1;
			}
		}
		// Paddle 2
		else if (ballFutureY <= 0 + ballGlobalRadius)
		{
			if (ballFutureX + ballGlobalRadius / 2 >= paddleP2X &&
				ballFutureX - ballGlobalRadius / 2 <= paddleP2X + paddleGlobalWidth - paddleGlobalReduction)
			{
				collision = 2;
			}
		}
		return collision;
	}
	
	function collisionCheck_ballWall(ballFutureX: number, ballFutureY: number): boolean
	{
		let collision: boolean = false;
		
		if (ballFutureX <= 0 ||
			ballFutureX >= canvasWidth)
		{
			collision = true;
		}
		return collision;
	}
	
	function collisionCheck_lostBall(ballFutureX: number, ballFutureY: number): number
	{
		let whoLostBall: number = 0;
		
		if (ballFutureY <= 0 + ballGlobalRadius)
		{
			whoLostBall = 2;
		}
		else if (ballFutureY >= canvasHeight - ballGlobalRadius)
		{
			whoLostBall = 1;
		}
		return whoLostBall;
	}
	
	function collisionCheck_foxBall(ballX: number, ballY: number, foxWidth: number, foxHeight: number): string
	{
		let collision = "";
		
		// Check "up" (with 3 pixels error margin)
		if (ballX >= foxPosX && ballX <= foxPosX + foxWidth &&
			ballY >= foxPosY - 3 && ballY <= foxPosY + 10)
			//ballY >= foxPosY - 3 && ballY <= foxPosY + 3)
		{
			collision = "up";
		}
		// Check "down" (with 3 pixels error margin)
		else if (ballX >= foxPosX && ballX <= foxPosX + foxWidth &&
				 ballY >= foxPosY + foxHeight - 10 && ballY <= foxPosY + foxHeight + 3)
				 //ballY >= foxPosY + imageFoxBad.height - 3 && ballY <= foxPosY + imageFoxBad.height + 3)
		{
			collision = "down";
		}
		// Check "left" (with 3 pixels error margin)
		else if (ballY >= foxPosY && ballY <= foxPosY + foxHeight &&
				 ballX >= foxPosX - 3 && ballX <= foxPosX + 10)
				 //ballX >= foxPosX - 3 && ballX <= foxPosX + 3)
		{
			collision = "left";
		}
		// Check "right" (with 3 pixels error margin)
		else if (ballY >= foxPosY && ballY <= foxPosY + foxHeight &&
				 ballX >= foxPosX + foxWidth - 10 && ballX <= foxPosX + foxWidth + 3)
				 //ballX >= foxPosX + imageFoxBad.width - 3 && ballX <= foxPosX + imageFoxBad.width + 3)
		{
			collision = "right";
		}
		return collision;
	}
	
	function collisionCheck_foxPaddle(paddleX: number, paddleY: number, foxWidth: number, foxHeight: number): boolean
	{
		let collision = false;
		
		if (paddleY === 0)
		{
			if (foxPosX + foxWidth >= paddleX && foxPosX <= paddleX + paddleGlobalWidth - paddleGlobalReduction &&
				foxPosY <= paddleY + paddleGlobalHeight)
			{
				collision = true;
			}
		}
		else
		{
			if (foxPosX + foxWidth >= paddleX && foxPosX <= paddleX + paddleGlobalWidth - paddleGlobalReduction &&
				foxPosY + foxHeight >= paddleY)
			{
				collision = true;
			}
		}
		return collision;
	}
	
	// With position correction
	function collisionCheck_foxWall(foxWidth: number, foxHeight: number): string
	{
		let collision = "";
		
		if (foxPosX + (foxSpeed * foxDirX) <= 0)
		{
			collision = "left";
			foxPosX = 1;
		}
		else if (foxPosX + foxWidth + (foxSpeed * foxDirX) >= canvasWidth)
		{
			collision = "right";
			foxPosX = canvasWidth - foxWidth - 1;
		}
		else if (foxPosY + (foxSpeed * foxDirY) <= 0)
		{
			collision = "up";
			foxPosY = 1;
		}
		else if (foxPosY + foxHeight + (foxSpeed * foxDirY) >= canvasHeight)
		{
			collision = "down";
			foxPosY = canvasHeight - foxHeight - 1;
		}
		return collision;
	}
	
	function collisionCheck(): void
	{
		Collisions.collision_ball1_paddle1 = 0;
		Collisions.collision_ball1_paddle2 = 0;
		Collisions.collision_ball1_wall = false;
		Collisions.ball1_loser = 0;
		Collisions.collision_ball2_paddle1 = 0;
		Collisions.collision_ball2_paddle2 = 0;
		Collisions.collision_ball2_wall = false;
		Collisions.ball2_loser = 0;
		
		Collisions.fox_ball1 = "";
		Collisions.fox_ball2 = "";
		Collisions.fox_paddle1 = false;
		Collisions.fox_paddle2 = false;
		Collisions.fox_wall = "";
	
		Collisions.collision_ball1_paddle1 = collisionCheck_ballPaddle(ball1X + (ball1SpeedX * ball1DirX), ball1Y + (ball1SpeedY * ball1DirY));
		Collisions.collision_ball1_paddle2 = collisionCheck_ballPaddle(ball1X + (ball1SpeedX * ball1DirX), ball1Y + (ball1SpeedY * ball1DirY));
		Collisions.collision_ball1_wall = collisionCheck_ballWall(ball1X + (ball1SpeedX * ball1DirX), ball1Y + (ball1SpeedY * ball1DirY));
		Collisions.ball1_loser = 0;
		if (Collisions.collision_ball1_paddle1 === 0 && Collisions.collision_ball1_paddle2 === 0)
		{
			Collisions.ball1_loser = collisionCheck_lostBall(ball1X + (ball1SpeedX * ball1DirX), ball1Y + (ball1SpeedY * ball1DirY));
		}
		
		if (isUnlockedSecondBall)
		{
			Collisions.collision_ball2_paddle1 = collisionCheck_ballPaddle(ball2X + (ball2SpeedX * ball2DirX), ball2Y + (ball2SpeedY * ball2DirY));
			Collisions.collision_ball2_paddle2 = collisionCheck_ballPaddle(ball2X + (ball2SpeedX * ball2DirX), ball2Y + (ball2SpeedY * ball2DirY));
			Collisions.collision_ball2_wall = collisionCheck_ballWall(ball2X + (ball2SpeedX * ball2DirX), ball2Y + (ball2SpeedY * ball2DirY));
			Collisions.ball2_loser = 0;
			if (Collisions.collision_ball2_paddle1 === 0 || Collisions.collision_ball2_paddle2 === 0)
			{
				Collisions.ball2_loser = collisionCheck_lostBall(ball2X + (ball2SpeedX * ball2DirX), ball2Y + (ball2SpeedY * ball2DirY));
			}
		}
		
		if (isUnlockedFox)
		{
			if (foxIsEnraged)
			{
				var foxWidth = 153;
				var foxHeight = 149;
			}
			else
			{
				var foxWidth = 50;
				var foxHeight = 49;
			}
			
			Collisions.fox_ball1 = collisionCheck_foxBall(ball1X, ball1Y, foxWidth, foxHeight);
			Collisions.fox_ball2 = collisionCheck_foxBall(ball2X, ball2Y, foxWidth, foxHeight);
			Collisions.fox_paddle1 = collisionCheck_foxPaddle(paddleP1X, canvasHeight - paddleGlobalHeight, foxWidth, foxHeight);
			Collisions.fox_paddle2 = collisionCheck_foxPaddle(paddleP2X, 0, foxWidth, foxHeight);
			Collisions.fox_wall = collisionCheck_foxWall(foxWidth, foxHeight);
		}
	}
	
	function moveBalls(): void
	{
		// Move Ball 1
		if (isUnlockedFox && foxIsEnraged)
		{
			if (Collisions.fox_ball1 === "up")
			{
				if (ball1DirY === 1)
				{
					ball1DirY = -ball1DirY;
				}
			}
			else if (Collisions.fox_ball1 === "down")
			{
				if (ball1DirY === -1)
				{
					ball1DirY = -ball1DirY;
				}
			}
			else if (Collisions.fox_ball1 === "left")
			{
				if (ball1DirX === 1)
				{
					ball1DirX = -ball1DirX;
				}
			}
			else if (Collisions.fox_ball1 === "right")
			{
				if (ball1DirX === -1)
				{
					ball1DirX = -ball1DirX;
				}
			}
		}
		
		if (Collisions.collision_ball1_paddle1 != 0 || Collisions.collision_ball1_paddle2 != 0)
		{
			ball1DirY = -ball1DirY;
			ball1Y = ball1Y + (ball1SpeedY * ball1DirY);
		}
		else if (Collisions.collision_ball1_wall === true)
		{
			ball1DirX = -ball1DirX;
			ball1X = ball1X + (ball1SpeedX * ball1DirX);
		}
		else if (Collisions.ball1_loser != 0)
		{
			ball1X = canvasWidth / 2;
			ball1Y = canvasHeight / 2;
		}
		else
		{
			ball1X = ball1X + (ball1SpeedX * ball1DirX);
			ball1Y = ball1Y + (ball1SpeedY * ball1DirY);
		}
		
		// Move Ball 2
		if (isUnlockedSecondBall)
		{
			if (isUnlockedFox && foxIsEnraged)
			{
				if (Collisions.fox_ball2 === "up")
				{
					if (ball2DirY === 1)
					{
						ball2DirY = -ball2DirY;
					}
				}
				else if (Collisions.fox_ball2 === "down")
				{
					if (ball2DirY === -1)
					{
						ball2DirY = -ball2DirY;
					}
				}
				else if (Collisions.fox_ball2 === "left")
				{
					if (ball2DirX === 1)
					{
						ball2DirX = -ball2DirX;
					}
				}
				else if (Collisions.fox_ball2 === "right")
				{
					if (ball2DirX === -1)
					{
						ball2DirX = -ball2DirX;
					}
				}
			}
			
			if (Collisions.collision_ball2_paddle1 != 0 || Collisions.collision_ball2_paddle2 != 0)
			{
				ball2DirY = -ball2DirY;
				ball2Y = ball2Y + (ball2SpeedY * ball2DirY);
			}
			else if (Collisions.collision_ball2_wall === true)
			{
				ball2DirX = -ball2DirX;
				ball2X = ball2X + (ball2SpeedX * ball2DirX);
			}
			else if (Collisions.ball2_loser != 0)
			{
				ball2X = canvasWidth / 2;
				ball2Y = canvasHeight / 2;
			}
			else
			{
				ball2X = ball2X + (ball2SpeedX * ball2DirX);
				ball2Y = ball2Y + (ball2SpeedY * ball2DirY);
			}
		}
	}
	
	function moveFox(timestamp: number): void
	{
		if (isUnlockedFox)
		{
			if (foxIsAttacking)
			{
				if (Math.floor(Math.random() * 100) === 42)
				{
					foxTimestampLastAppeased = timestamp;
					foxTimeTillEnraged = 10000 + Math.random() * 20;
					foxIsAttacking = false;
					foxIsEnraged = false;
					foxIsEvil = false;
					foxSpeed = foxSpeedDefault + ballGlobalSpeedAddedPerma;
				}
			}
			else if (foxIsEnraged)
			{
				if (Math.floor(Math.random() * 100) === 42)
				{
					foxDirX = -foxDirX;
				}
				if (Math.floor(Math.random() * 100) === 42)
				{
					foxDirY = -foxDirY;
				}
				foxPosX = foxPosX + (foxSpeed * foxDirX);
				foxPosY = foxPosY + (foxSpeed * foxDirY);
				if (Collisions.fox_paddle1 === true || Collisions.fox_paddle2 === true)
				{
					foxIsAttacking = true;
					foxSpeed = 0;
					fox_sounds_evil();
				}
			}
			else if (foxIsEvil)
			{
				foxPosX = foxPosX + (foxSpeed * foxDirX);
				foxPosY = foxPosY + (foxSpeed * foxDirY);
				if (Collisions.fox_paddle1 === true || Collisions.fox_paddle2 === true)
				{
					foxIsAttacking = true;
					foxSpeed = 0;
					fox_sounds_evil();
				}
				if (foxIsAttacking === false && Math.floor(Math.random() * 1000) % 100 === 0)
				{
					foxIsEvil = false;
				}
				if (foxIsAttacking === false && timestamp - foxTimestampLastAppeased >= foxTimeTillEnraged)
				{
					audioFoxEnrage.current.play();
					foxIsEnraged = true;
					foxIsEvil = true;
					foxSpeed = 15;
				}
			}
			else
			{
				foxPosX = foxPosX + (foxSpeed * foxDirX);
				foxPosY = foxPosY + (foxSpeed * foxDirY);
				if (Collisions.fox_paddle1 === true)
				{
					foxDirY = -1;
					foxTimestampLastAppeased = timestamp;
					foxTimeTillEnraged = 10000 + Math.random() * 20;
					fox_sounds_good();
				}
				else if (Collisions.fox_paddle2 === true)
				{
					foxDirY = 1;
					foxTimestampLastAppeased = timestamp;
					foxTimeTillEnraged = 10000 + Math.random() * 20;
					fox_sounds_good();
				}
				if (Math.floor(Math.random() * 1000) % 100 === 0)
				{
					foxIsEvil = true;
				}
				if (foxIsAttacking === false && timestamp - foxTimestampLastAppeased >= foxTimeTillEnraged)
				{
					audioFoxEnrage.current.play();
					foxIsEnraged = true;
					foxIsEvil = true;
					foxSpeed = 15;
				}
			}
			
			if (Collisions.fox_wall === "up")
			{
				foxPosY++;
				foxDirY = -foxDirY;
			}
			else if (Collisions.fox_wall === "down")
			{
				foxPosY--;
				foxDirY = -foxDirY;
			}
			else if (Collisions.fox_wall === "left")
			{
				foxPosX++;;
				foxDirX = -foxDirX;
			}
			else if (Collisions.fox_wall === "right")
			{
				foxPosX--;
				foxDirX = -foxDirX;
			}
		}
		else
		{
			foxTimestampLastAppeased = timestamp;
		}
	}
	
	function fox_sounds_good(): void
	{
		let selector: number = Math.floor(Math.random() * 100) % 7;
		
		if (selector === 0)
		{
			audioFoxChicken.current.play();
		}
		else if (selector === 1)
		{
			audioFoxGoat.current.play();
		}
		else if (selector === 2)
		{
			audioFoxMeow.current.play();
		}
		else if (selector === 3)
		{
			audioFoxPig.current.play();
		}
		else if (selector === 4)
		{
			audioFoxQuack.current.play();
		}
		else if (selector === 5)
		{
			audioFoxTweet.current.play();
		}
		else if (selector === 6)
		{
			audioFoxWoof.current.play();
		}
	}
	
	function fox_sounds_evil(): void
	{
		let selector: number = Math.floor(Math.random() * 100) % 5;
		
		if (selector === 0)
		{
			audioFoxAhee.current.play();
		}
		else if (selector === 1)
		{
			audioFoxCha.current.play();
		}
		else if (selector === 2)
		{
			audioFoxKaka.current.play();
		}
		else if (selector === 3)
		{
			audioFoxPapa.current.play();
		}
		else if (selector === 4)
		{
			audioFoxYok.current.play();
		}
	}
	
	function movePaddles(): void
	{
		if (isUnlockedFox)
		{
			if (foxIsEvil)
			{
				if (Collisions.fox_paddle1 === true)
				{
					paddleP1IsAttacked = true;
					paddleP2IsAttacked = false;
				}
				else if (Collisions.fox_paddle2 === true)
				{
					paddleP2IsAttacked = true;
					paddleP1IsAttacked = false;
				}
				else
				{
					paddleP1IsAttacked = false;
					paddleP2IsAttacked = false;
				}
			}
		}
		
		if (paddleP1IsAttacked === false)
		{
			if (keyDownPressed)
			{
				paddleP1SpeedMod = 10;
			}
			else
			{
				paddleP1SpeedMod = 0;
			}
			
			if (keyRightPressed)
			{
				paddleP1X = Math.min(paddleP1X + paddleGlobalSpeed + paddleP1SpeedMod, canvasWidth - (paddleGlobalWidth - paddleGlobalReduction));
			}
			else if (keyLeftPressed)
			{
				paddleP1X = Math.max(paddleP1X - paddleGlobalSpeed - paddleP1SpeedMod, 0);
			}
		}
		
		if (paddleP2IsAttacked === false)
		{
			if (keySPressed)
			{
				paddleP2SpeedMod = 10;
			}
			else
			{
				paddleP2SpeedMod = 0;
			}
		
			if (keyDPressed)
			{
				paddleP2X = Math.min(paddleP2X + paddleGlobalSpeed + paddleP2SpeedMod, canvasWidth - (paddleGlobalWidth - paddleGlobalReduction));
			}
			else if (keyAPressed)
			{
				paddleP2X = Math.max(paddleP2X - paddleGlobalSpeed - paddleP2SpeedMod, 0);
			}
		}
	}

	function control_RGB(): void
	{
		// Randomize colors on ball bounce
		if (isUnlockedRandomRGB1)
		{
			if (Collisions.collision_ball1_paddle1 != 0 ||
				Collisions.collision_ball1_paddle2 != 0 ||
				Collisions.collision_ball2_paddle1 != 0 ||
				Collisions.collision_ball2_paddle2 != 0 ||
				Collisions.collision_ball1_wall === true ||
				Collisions.collision_ball2_wall === true)
			{
				randomizeColors();
			}
		}
		
		// Randomize colors ADDITIONALLY at random times
		if (isUnlockedRandomRGB2)
		{
			if (Math.floor(Math.random() * 100) === 42)
			{
				randomizeColors();
			}
		}
	}
	
	function control_music(): void
	{
		if (difficultyScore < 5)
		{
			if (musicBavaria.current.paused || musicBavaria.current.ended)
			{
				musicBavaria.current.play();
			}
		}
		else if (difficultyScore < 10)
		{
			musicBavaria.current.pause();
			if (musicMushroomKingdom.current.paused || musicMushroomKingdom.current.ended)
			{
				musicMushroomKingdom.current.play();
			}
		}
		else if (difficultyScore < 15)
		{
			musicMushroomKingdom.current.pause();
			if (musicNumberOne.current.paused || musicNumberOne.current.ended)
			{
				musicNumberOne.current.play();
			}
		}
		else if (difficultyScore < 30)
		{
			musicNumberOne.current.pause();
			if (musicStubb.current.paused || musicStubb.current.ended)
			{
				musicStubb.current.play();
			}
		}
		else
		{
			musicStubb.current.pause()
		}
	}
	
	function gnome_swap_1_2(): void
	{
		let temp_ball1X: number = ball1X;
		let temp_ball1Y: number = ball1Y;
		let temp_ball1DirX: number = ball1DirY;
		let temp_ball1DirY: number = ball1DirY;
		
		ball1X = ball2X;
		ball1Y = ball2Y;
		ball1DirX = ball2DirX;
		ball1DirY = ball2DirY;
		
		ball2X = temp_ball1X;
		ball2Y = temp_ball1Y;
		ball2DirX = temp_ball1DirX;
		ball2DirY = temp_ball1DirY;
	}
	
	function gnome_swap_1_fox(): void
	{
		let temp_ball1X: number = ball1X;
		let temp_ball1Y: number = ball1Y;
		let temp_ball1DirX: number = ball1DirY;
		let temp_ball1DirY: number = ball1DirY;
		
		ball1X = foxPosX;
		ball1Y = foxPosY;
		ball1DirX = foxDirX;
		ball1DirY = foxDirY;
		
		foxPosX = temp_ball1X;
		foxPosY = temp_ball1Y;
		foxDirX = temp_ball1DirX;
		foxDirY = temp_ball1DirY;
	}
	
	function gnome_swap_2_fox(): void
	{
		let temp_ball2X: number = ball2X;
		let temp_ball2Y: number = ball2Y;
		let temp_ball2DirX: number = ball2DirY;
		let temp_ball2DirY: number = ball2DirY;
		
		ball2X = foxPosX;
		ball2Y = foxPosY;
		ball2DirX = foxDirX;
		ball2DirY = foxDirY;
		
		foxPosX = temp_ball2X;
		foxPosY = temp_ball2Y;
		foxDirX = temp_ball2DirX;
		foxDirY = temp_ball2DirY;
	}
	
	function gnome_swap(): void
	{
		if (isUnlockedSecondBall)
		{
			if (Math.floor(Math.random() * 100) % 2 === 0)
			{
				gnome_swap_1_2();
			}
			if (Math.floor(Math.random() * 100) % 2 === 0)
			{
				gnome_swap_1_fox();
			}
			if (Math.floor(Math.random() * 100) % 2 === 0)
			{
				gnome_swap_2_fox();
			}
		}
		else if (isUnlockedFox)
		{
			if (Math.floor(Math.random() * 100) % 2 === 0)
			{
				gnome_swap_1_fox();
			}
		}
	}
	
	function harkinian_hit(random_number: number): void
	{
		var mod: number = 1;
		
		if (isUnlockedSecondBall)
		{
			mod = 3;
		}
		else if (isUnlockedFox)
		{
			mod = 2;
		}
		
		if (random_number % mod === 0)
		{
			harkinianX = ball1X - harkinianWidth / 2;
			harkinianY = ball1Y - harkinianHeight / 2;
			ball1DirX = -ball1DirX;
			ball1DirY = -ball1DirY;
		}
		else if (random_number % mod === 1)
		{
			harkinianX = foxPosX - harkinianWidth / 2;
			harkinianY = foxPosY - harkinianHeight / 2;
			foxDirX = -foxDirX;
			foxDirY = -foxDirY;
		}
		else if (random_number % mod === 2)
		{
			harkinianX = ball2X - harkinianWidth / 2;
			harkinianY = ball2Y - harkinianHeight / 2;
			ball2DirX = -ball2DirX;
			ball2DirY = -ball2DirY;
		}
	}
	
	function mcrolld(ctx: CanvasRenderingContext2D): void
	{
		if (isUnlockedVideo)
		{
			if (mcrolldReverseQueued && (videoMcrolld.current.paused || videoMcrolld.current.ended))
			{
				videoToDraw = videoMcrolldReverse.current;
				videoMcrolldReverse.current.play();
				mcrolldReverseQueued = false;
				mcrolldQueued = true;
			}
			else if (mcrolldQueued && (videoMcrolldReverse.current.paused || videoMcrolldReverse.current.ended))
			{
				videoToDraw = videoMcrolld.current;
				videoMcrolld.current.play();
				mcrolldQueued = false;
				mcrolldReverseQueued = true;
			}
			ctx.drawImage(videoToDraw, (canvasWidth - 1024) / 2, (canvasHeight - 768) / 2, 1024, 768);
		}
	}
	
	function popup_trap(): void
	{
		if (isUnlockedPopups)
		{
			if (Math.floor(Math.random() * 10000) === 666)
			{
				var selector = Math.floor(Math.random() * 100) % 5;
				if (selector === 0)
				{
					alert("cLICK THIS LINK AND WIN 1 BITCOIN!!! http://hostmyvirus.co.ck/f1L3r4p3");
				}
				else if (selector === 1)
				{
					alert("Want see many womans whit BIG BALLS??? Clik her http://baitandhack.ro/r4n50mM0n573r-Tr0j4n");
				}
				else if (selector === 2)
				{
					alert("You are FBI suspekt childs pronorgafy! You have right to a turny! Free lawers best servis CALL NOW!!! +40769 666 911");
				}
				else if (selector === 3)
				{
					alert("1 new message from Elon Musk: Hello I am Elon Musk I end world hunger I love you send $100 to my wallet 4DZpldiB34afdq5BjdwT9ayHyLJnkMbKevc8 I send you 1000.000.000 DOGE");
				}
				else if (selector === 4)
				{
					alert("Legal drugs online order 100% SAFE http://jestesglupilol.pl");
				}
			}
		}
	}
	
	function updateVariables(): void
	{
		ball1SpeedX = ballGlobalSpeedDefault + ballGlobalSpeedAddedPerma + ballGlobalSpeedAddedTemp;
		ball1SpeedY = ballGlobalSpeedDefault + ballGlobalSpeedAddedPerma + ballGlobalSpeedAddedTemp;
		ball2SpeedX = ballGlobalSpeedDefault + ballGlobalSpeedAddedPerma + ballGlobalSpeedAddedTemp;
		ball2SpeedY = ballGlobalSpeedDefault + ballGlobalSpeedAddedPerma + ballGlobalSpeedAddedTemp;
		
		// Upon losing the ball
		if (Collisions.ball1_loser != 0)
		{
			ballPaddleBounces = 0;
			ballGlobalSpeedAddedTemp = 0;
			
			// Reset dir for Ball 1
			if (Math.floor(Math.random() * 100) % 2 === 0)
			{
				ball1DirX = -1;
			}
			else
			{
				ball1DirX = 1;
			}
			if (Math.floor(Math.random() * 100) % 2 === 0)
			{
				ball1DirY = -1;
			}
			else
			{
				ball1DirY = 1;
			}
		}
		if (Collisions.ball2_loser != 0)
		{
			ballPaddleBounces = 0;
			ballGlobalSpeedAddedTemp = 0;
			
			// Reset dir for Ball 2
			if (Math.floor(Math.random() * 100) % 2 === 0)
			{
				ball2DirX = -1;
			}
			else
			{
				ball2DirX = 1;
			}
			if (Math.floor(Math.random() * 100) % 2 === 0)
			{
				ball2DirY = -1;
			}
			else
			{
				ball2DirY = 1;
			}
		}
	}
	
	function updateScores(): void
	{
		// Ball 1
		if (Collisions.ball1_loser === 1)
		{
			scoreP2++;
		}
		else if (Collisions.ball1_loser === 2)
		{
			scoreP1++;
		}
		
		// Ball 2
		if (isUnlockedSecondBall)
		{
			if (Collisions.ball2_loser === 1)
			{
				scoreP2++;
			}
			else if (Collisions.ball2_loser === 2)
			{
				scoreP1++;
			}
		}			
	}
	
	function difficultyHandler(): void
	{
		// When total score reaches 5
		if (scoreP1 + scoreP2 === 5 && difficultyScore < 5)
		{
			difficultyScore = 5;
			isUnlockedGnome = true;
		}
		else if (scoreP1 + scoreP2 === 10 && difficultyScore < 10)
		{
			difficultyScore = 10;
			isUnlockedRandomRGB1 = true;
		}
		else if (scoreP1 + scoreP2 === 15 && difficultyScore < 15)
		{
			difficultyScore = 15;
			isUnlockedHarkinian = true;
		}
		else if (scoreP1 + scoreP2 === 20 && difficultyScore < 20)
		{
			difficultyScore = 20;
			isUnlockedRandomRGB2 = true;
		}
		else if (scoreP1 + scoreP2 === 30 && difficultyScore < 30)
		{
			difficultyScore = 30;
			isUnlockedFox = true;
			isUnlockedVideo = true;
		}
		else if (scoreP1 + scoreP2 === 40 && difficultyScore < 40)
		{
			difficultyScore = 40;
			isUnlockedSecondBall = true;
		}
		else if (scoreP1 + scoreP2 === 50 && difficultyScore < 50)
		{
			difficultyScore = 50;
			isUnlockedPopups = true;
		}
		adjust_ballAndPaddle();
	}
	
	// Permanent adjustments to the balls and paddles
	function adjust_ballAndPaddle(): void
	{
		if (Collisions.collision_ball1_paddle1 != 0 || Collisions.collision_ball1_paddle2 != 0)
		{
			ballPaddleBounces++;
		}
		if (isUnlockedSecondBall &&
			(Collisions.collision_ball2_paddle1 != 0 || Collisions.collision_ball2_paddle2 != 0))
		{
			ballPaddleBounces++;
		}
		
		ballGlobalSpeedAddedTemp = ballPaddleBounces * 0.3;
	
		if (difficultyScore % 5 === 0 &&
			difficultyScore > 0 &&
			difficultyBallAndPaddle < Math.floor(difficultyScore / 5))
		{
			if (Math.floor(Math.random() * 100) % 2 === 0 || paddleGlobalWidth - paddleGlobalReduction === 35)
			{
				ballGlobalSpeedAddedPerma = ballGlobalSpeedAddedPerma + 0.5;
				foxSpeed = foxSpeedDefault + ballGlobalSpeedAddedPerma;
			}
			else
			{
				paddleGlobalReduction = paddleGlobalReduction + 5;
			}
			difficultyBallAndPaddle++;
		}
	}
	
	useEffect(() => {
		// Function to handle key down event
		const handleKeyDown = (event: KeyboardEvent) =>
		{
			if (event.key === 'ArrowLeft' || event.key === 'Left')
			{
				keyLeftPressed = true;
			}
			else if (event.key === 'ArrowRight' || event.key === 'Right')
			{
				keyRightPressed = true;
			}
			else if (event.key === 'ArrowDown' || event.key === 'Down')
			{
				keyDownPressed = true;
			}

			if (event.key === 'A' || event.key === 'a')
			{
				keyAPressed = true;
			}
			else if (event.key === 'D' || event.key === 'd')
			{
				keyDPressed = true;
			}
			else if (event.key === 'S' || event.key === 's')
			{
				keySPressed = true;
			}
		};
	
		// Function to handle key up event
		const handleKeyUp = (event: KeyboardEvent) =>
		{
			if (event.key === 'ArrowLeft' || event.key === 'Left')
			{
				keyLeftPressed = false;
			}
			else if (event.key === 'ArrowRight' || event.key === 'Right')
			{
				keyRightPressed = false;
			}
			else if (event.key === 'ArrowDown' || event.key === 'Down')
			{
				keyDownPressed = false;
			}

			if (event.key === 'A' || event.key === 'a')
			{
				keyAPressed = false;
			}
			else if (event.key === 'D' || event.key === 'd')
			{
				keyDPressed = false;
			}
			else if (event.key === 'S' || event.key === 's')
			{
				keySPressed = false;
			}
		};
	
		// Attach event listeners when the component mounts
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	
		// Clean up event listeners when the component unmounts
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	
	}, []);

	const [receivedFrame, setReceivedFrame] = useState<GameState>({
        paddle1: { x: 0, y: 0 },
        paddle2: { x: 0, y: 0 },
        ball: { x: 0, y: 0 },
        score1: 0,
        score2: 0,
    });

	var ballFromBackendX: number = canvasWidth / 2;
	var ballFromBackendY: number = canvasHeight / 2;

	const socket = useContext(WebsocketContext);

	useEffect(() =>
	{
		let frameCount: number = 0;

		const eventName = `GameLoop`;
        socket.on(eventName, (newFrame: GameState) => {
            setReceivedFrame(newFrame);
			// console.log("ball from useEffect() FRONTEND: " + newFrame.ball.x + ", " + newFrame.ball.y);
			ballFromBackendX = newFrame.ball.x;
			ballFromBackendY = newFrame.ball.y;
        });
	
		const sendMessageToBackend = () => {
		  socket.emit('sendToBackend', paddleP1X);
		//   console.log("FRONTEND Sent data to backend: " + paddleP1X);
		};
	
		if (canvasRef.current)
		{
			const context = canvasRef.current.getContext('2d');

			const drawClassic = (timestamp: number) =>
			{
				if (!thenRef.current)
				{
			  		thenRef.current = timestamp;
			  		startTimeRef.current = timestamp;
				}

				const elapsed: number = timestamp - thenRef.current;
				const interval: number = 1000 / frameRate;

				if (elapsed > interval)
				{
					thenRef.current = timestamp - (elapsed % interval);

					context.clearRect(0, 0, canvasWidth, canvasHeight);
	
					drawBackground(context);
			
					drawBalls(context);
					drawBallFromBackend(context, receivedFrame);
					drawPaddles(context);
			
					drawScore(context);
			
					updateVariables();
			
					collisionCheck();
			
					movePaddles();
					moveBalls();
			
					updateVariables();
					updateScores();

					frameCount++;
				}

				requestAnimationFrame(drawClassic);
		  	};

			const drawEnhanced = (timestamp: number) =>
			{
				if (!thenRef.current)
				{
			  		thenRef.current = timestamp;
			  		startTimeRef.current = timestamp;
				}

				const elapsed: number = timestamp - thenRef.current;
				const interval: number = 1000 / frameRate;

				if (elapsed > interval)
				{
					thenRef.current = timestamp - (elapsed % interval);

					context.clearRect(0, 0, canvasWidth, canvasHeight);
	
					drawBackground(context);
			
					mcrolld(context);
			
					drawBalls(context);
					drawBallFromBackend(context, receivedFrame);
					drawPaddles(context);
			
					drawFox(context);
					drawGnome(context, timestamp);
					drawHarkinian(context);
					drawScore(context);
			
					updateVariables();
			
					collisionCheck();
					control_music();
					control_RGB();
			
					movePaddles();
					moveBalls();
					moveFox(timestamp);
			
					popup_trap(); // Works, but needs more research
			
					updateVariables();
					updateScores();
					difficultyHandler();

					sendMessageToBackend();

					frameCount++;
				}

				requestAnimationFrame(drawEnhanced);
			};

			const calculateFrameRate = () =>
			{
				const now: number = performance.now();
				const elapsed: number = now - startTimeRef.current!;

				if (elapsed >= 1000)
				{
					const fps: number = (frameCount / elapsed) * 1000;
					// console.log(`Frame rate: ${fps.toFixed(2)} FPS`);

					frameCount = 0; // Reset frameCount

					startTimeRef.current = now;
				}

				requestAnimationFrame(calculateFrameRate);
			};

			calculateFrameRate();
			if (classicMode === true)
			{
				ballGlobalSpeedDefault = 7;
				requestAnimationFrame(drawClassic);
			}
			else
				requestAnimationFrame(drawEnhanced);
		}

		return () => {
            console.log("Unregistering Events...");
            socket.off(eventName);
        };
	}, [frameRate]);

	function drawBallFromBackend(ctx: CanvasRenderingContext2D, backendFrame: GameState): void
	{
		ctx.beginPath();
		// console.log("backendFrame.ball: " + backendFrame.ball.x + ", " + backendFrame.ball.y);
		// console.log("ballFromBackend X and Y: " + ballFromBackendX + ", " + ballFromBackendY);
		// ctx.arc(backendFrame.ball.x, backendFrame.ball.y, ballGlobalRadius, 0, Math.PI * 2);
		ctx.arc(ballFromBackendX, ballFromBackendY, ballGlobalRadius, 0, Math.PI * 2);
		ctx.fillStyle = "#FF0000";
		ctx.fill();
		ctx.closePath();
	}

	return (
		<div>
			<canvas ref={canvasRef} tabIndex={0} width={canvasWidth} height={canvasHeight}></canvas>
			<audio ref={audioGnome}>
        		<source src={audioGnomeSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={audioHarkinianHit}>
        		<source src={audioHarkinianHitSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={audioHarkinianOah}>
        		<source src={audioHarkinianOahSrc} type="audio/mp3"/>
      		</audio>
			  <audio ref={audioFoxMeow}>
        		<source src={audioFoxMeowSrc} type="audio/mp3"/>
      		</audio>
			  <audio ref={audioFoxWoof}>
        		<source src={audioFoxWoofSrc} type="audio/mp3"/>
      		</audio>
			  <audio ref={audioFoxQuack}>
        		<source src={audioFoxQuackSrc} type="audio/mp3"/>
      		</audio>
			  <audio ref={audioFoxChicken}>
        		<source src={audioFoxChickenSrc} type="audio/mp3"/>
      		</audio>
			  <audio ref={audioFoxGoat}>
        		<source src={audioFoxGoatSrc} type="audio/mp3"/>
      		</audio>
			  <audio ref={audioFoxPig}>
        		<source src={audioFoxPigSrc} type="audio/mp3"/>
      		</audio>
			  <audio ref={audioFoxTweet}>
        		<source src={audioFoxTweetSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={audioFoxAhee}>
        		<source src={audioFoxAheeSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={audioFoxCha}>
        		<source src={audioFoxChaSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={audioFoxKaka}>
        		<source src={audioFoxKakaSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={audioFoxPapa}>
        		<source src={audioFoxPapaSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={audioFoxYok}>
        		<source src={audioFoxYokSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={audioFoxEnrage}>
        		<source src={audioFoxEnrageSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={musicBavaria}>
        		<source src={musicBavariaSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={musicMushroomKingdom}>
        		<source src={musicMushroomKingdomSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={musicNumberOne}>
        		<source src={musicNumberOneSrc} type="audio/mp3"/>
      		</audio>
			<audio ref={musicStubb}>
        		<source src={musicStubbSrc} type="audio/mp3"/>
      		</audio>
			<video ref={videoMcrolld} style={{ display: 'none' }}>
        		<source src={videoMcrolldSrc} type="video/mp4"/>
      		</video>
			  <video ref={videoMcrolldReverse} style={{ display: 'none' }}>
        		<source src={videoMcrolldReverseSrc} type="video/mp4"/>
      		</video>
			<video ref={videoHarkinianHit} style={{ display: 'none' }}>
        		<source src={videoHarkinianHitSrc} type="video/mp4"/>
      		</video>
			<JoinRandom />
			{/* <ReceivedGameData /> */}
		</div>
	);
};

export default Game;
