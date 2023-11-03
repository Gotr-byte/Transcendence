import { useRef, useEffect, useState, useContext } from 'react';
import { WebsocketContext } from '../components/Context/WebsocketContexts';
import JoinRandom from '../components/Game/JoinRandom';
import AbortMatchmaking from '../components/Game/AbortMatchmaking';

interface Coordinates {
	x: number;
	y: number;
}

interface GameState {
	paddleOne: Coordinates;
	paddleTwo: Coordinates;
	ball: Coordinates;
	scoreOne: number;
	scoreTwo: number;
}

const Game: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [gameState, setGameState] = useState<GameState | null>(null);

	const socketIo = useContext(WebsocketContext);

	useEffect(() => {
		socketIo.on('GameLoop', (data: GameState) => {
			if (data.ball.x !== undefined && data.ball.y !== undefined) {
				setGameState(data);
			}
		});

		socketIo.on('disconnect', () => {
			console.log('Socket.io connection disconnected.');
		});
	}, [socketIo]);

	useEffect(() => {

		const handleKeyDown = (event: KeyboardEvent) =>
		{
			if (event.key == 'ArrowUp' || event.key == 'ArrowDown')
			{
				console.log(event.key);
				socketIo.emit("keypress", event.key);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
	
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	
	}, [socketIo]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas && gameState) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				// Fill the canvas with white color
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				//paddles paddles are blue
				ctx.fillStyle = 'blue';
				ctx.beginPath();
				ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, 50, 240);
				ctx.closePath();
				ctx.beginPath();
				ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, 50, 240);
				ctx.closePath();
				ctx.font='48px serif';
				ctx.fillText(gameState.score1 + " : " + gameState.score2, 500, 360);
				// Draw the ball in red
				ctx.beginPath();
				ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, 2 * Math.PI); // 10 is the radius of the ball
				ctx.fillStyle = 'red';
				ctx.fill();
				ctx.closePath();
				// Draw the  second ball in yellow
				if (gameState.ball2lock)
				{
					ctx.beginPath();
					ctx.arc(gameState.ball2.x, gameState.ball2.y, 10, 0, 2 * Math.PI); // 10 is the radius of the ball
					ctx.fillStyle = 'yellow';
					ctx.fill();
					ctx.closePath();
				}
				if (gameState.fox.isUnlocked)
				{
					ctx.beginPath();
					ctx.arc(gameState.fox.pos.x, gameState.fox.pos.y, gameState.fox.hasSizeOf, 0, 2 * Math.PI); // 10 is the radius of the ball
					ctx.fillStyle = 'orange';
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}, [gameState]);

	return (
		<div>
					<JoinRandom />
					{/* <AbortMatchmaking /> */}
					<canvas ref={canvasRef} width="1200" height="720" style={{ border: '1px solid black' }}></canvas>
		</div>
	);
}

export default Game;
