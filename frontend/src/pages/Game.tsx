import { useRef, useEffect, useState, useContext } from 'react';
import { WebsocketContext } from '../components/Context/WebsocketContexts';
import JoinRandom from '../components/Game/JoinRandom';

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

		//set to same fps as the BE is working with
		//maybe on game init we can send the config data
		//as json to the FE, telling fps, canvasSize, paddlesize etc ?
		const fps = 1000 / 60;

		const interval = setInterval(() => {
			document.addEventListener('keydown', handleKeyDown);
		}, fps);
		
		const handleKeyDown = (event: KeyboardEvent) =>
		{
			if (event.key == 'ArrowUp' || event.key == 'ArrowDown')
			{
				console.log(event.key);
				socketIo.emit("keypress", event.key);
			}
		};
	
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			clearInterval(interval);
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

				// Draw the ball in red
				ctx.beginPath();
				ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, 2 * Math.PI); // 10 is the radius of the ball
				ctx.fillStyle = 'red';
				ctx.fill();
				ctx.closePath();
			}
		}
	}, [gameState]);

	return (
		<div>
					<JoinRandom />
					<canvas ref={canvasRef} width="1200" height="720" style={{ border: '1px solid black' }}></canvas>
		</div>
	);
}

export default Game;
