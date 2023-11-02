import { useRef, useEffect, useState, useContext } from 'react';
import { WebsocketContext } from '../components/Context/WebsocketContexts';
import JoinRandom from '../components/Game/JoinRandom';

import { useToast } from '@chakra-ui/react';

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
/*testing
*/
// interface Opponent {
// 	playerOneId: number;
// 	playerOneName: string;
// 	playerTwoId: number;
// 	playerTwoName: string;
// 	timestamp: number;
// }
// */

const Game: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [gameState, setGameState] = useState<GameState | null>(null);

	const socketIo = useContext(WebsocketContext);
	/* testing toast 


	const toast = useToast();

	const showToast = () => {
		toast({
				title: "Confirmation",
				description: "Do you agree?",
				status: "info",
				duration: 9000,
				isClosable: true,
				position: "top-right",
				render: () => (
						<div>
								Do you agree?
								<Button size="sm" colorScheme="green" onClick={() => { console.log('Yes Clicked'); toast.closeAll(); }}>Yes</Button>
								<Button size="sm" colorScheme="red" onClick={() => { console.log('No Clicked'); toast.closeAll(); }}>No</Button>
						</div>
				),
		});
	}
*/

	useEffect(() => {
		socketIo.on('GameLoop', (data: GameState) => {
			if (data.ball.x !== undefined && data.ball.y !== undefined) {
				setGameState(data);
			}
		});

		/*testing
		*/
		// socketIo.on('GameRequest', (data: Opponent) => {
		// 		// showToast()
		// 		console.log(data);
		// });
		
		//*/

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
				console.log("Ball2: " + gameState?.ball2.isUnlocked)
				ctx.beginPath();
				ctx.arc(gameState.ball2.x, gameState.ball2.y, 10, 0, 2 * Math.PI); // 10 is the radius of the ball
				ctx.fillStyle = 'yellow';
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
