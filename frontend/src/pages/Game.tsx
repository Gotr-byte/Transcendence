import { useRef, useEffect, useState, useContext } from 'react';
import { WebsocketContext } from '../components/Context/WebsocketContexts';
import JoinRandom from '../components/Game/JoinRandom';

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
          <canvas ref={canvasRef} width="2000" height="2000" style={{ border: '1px solid black' }}></canvas>
    </div>
  );
}

export default Game;
