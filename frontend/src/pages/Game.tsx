import { useRef, useEffect, useState, useContext } from "react";
import { WebsocketContext } from "../components/Context/WebsocketContexts";
import JoinRandom from "../components/Game/JoinRandom";
import { Box } from "@chakra-ui/react";
// import AbortMatchmaking from '../components/Game/AbortMatchmaking';

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

interface KeyPresses
{
	keyArrowUp: boolean;
	keyArrowDown: boolean;
	keySpace: boolean;
}

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const socketIo = useContext(WebsocketContext);

  useEffect(() => {
    socketIo.on("GameLoop", (data: GameState) => {
      if (data.ball.x !== undefined && data.ball.y !== undefined) {
        setGameState(data);
      }
    });

    socketIo.on("disconnect", () => {
      console.log("Socket.io connection disconnected.");
    });
  }, [socketIo]);

  var KeysPressed: KeyPresses =
	{
		keyArrowUp: false,
		keyArrowDown: false,
		keySpace: false
	}

	var keyString: string = "";
	
	useEffect(() => {
		// Function to handle key down event
		const handleKeyDown = (event: KeyboardEvent) =>
		{
			if (event.key === 'ArrowUp' || event.key === 'Up')
			{
				KeysPressed.keyArrowUp = true;
			}
			if (event.key === 'ArrowDown' || event.key === 'Down')
			{
				KeysPressed.keyArrowDown = true;
			}
			if (event.key === 'Space' || event.key === ' ')
			{
				KeysPressed.keySpace = true;
			}
			
			keyString = "";

			if (KeysPressed.keyArrowUp === true)
			{
				keyString = "ARROWUP";
			}
			else if (KeysPressed.keyArrowDown === true)
			{
				keyString = "ARROWDOWN";
			}
			if (KeysPressed.keySpace === true && keyString != "")
			{
				keyString = keyString + "+SPACE";
			}
			
			socketIo.emit('keypress', keyString);
		};
	
		// Function to handle key up event
		const handleKeyUp = (event: KeyboardEvent) =>
		{
			if (event.key === 'ArrowUp' || event.key === 'Up')
			{
				KeysPressed.keyArrowUp = false;
			}
			if (event.key === 'ArrowDown' || event.key === 'Down')
			{
				KeysPressed.keyArrowDown = false;
			}
			if (event.key === 'Space' || event.key === ' ')
			{
				KeysPressed.keySpace = false;
			}
			
			keyString = "";

			if (KeysPressed.keyArrowUp === true)
			{
				keyString = "ARROWUP";
			}
			else if (KeysPressed.keyArrowDown === true)
			{
				keyString = "ARROWDOWN";
			}
			if (KeysPressed.keySpace === true && keyString != "")
			{
				keyString = keyString + "+SPACE";
			}

			socketIo.emit('keypress', keyString);
		};
	
		// Attach event listeners when the component mounts
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
	
		// Clean up event listeners when the component unmounts
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	
	}, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && gameState) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Fill the canvas with black color
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Paddles are white
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, 10, 70);
        ctx.closePath();
        ctx.beginPath();
        ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, 10, 70);
        ctx.closePath();
        ctx.font = "48px serif";
		ctx.textAlign = 'center'; // Horizontal centering
		ctx.textBaseline = 'middle'; // Vertical centering
        ctx.fillText(gameState.score1 + " : " + gameState.score2, canvas.width / 2, canvas.height / 2);
        // Draw the ball in white
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, 15, 0, 2 * Math.PI); // 10 is the radius of the ball
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
        // Draw the  second ball in yellow
        // if (gameState.ball2lock) {
        //   ctx.beginPath();
        //   ctx.arc(gameState.ball2.x, gameState.ball2.y, 15, 0, 2 * Math.PI); // 10 is the radius of the ball
        //   ctx.fillStyle = "yellow";
        //   ctx.fill();
        //   ctx.closePath();
        // }
        // if (gameState.fox.isUnlocked) {
        //   ctx.beginPath();
        //   ctx.arc(
        //     gameState.fox.pos.x,
        //     gameState.fox.pos.y,
        //     gameState.fox.hasSizeOf,
        //     0,
        //     2 * Math.PI
        //   ); // 10 is the radius of the ball
        //   ctx.fillStyle = "orange";
        //   ctx.fill();
        //   ctx.closePath();
        // }
      }
    }
  }, [gameState]);

  return (
    <div>
      <JoinRandom />
      {/* <AbortMatchmaking /> */}
      <canvas
        ref={canvasRef}
        width="1200"
        height="720"
        style={{ border: "1px solid black" }}
      ></canvas>
      <Box bg="#e0dbb7" p={4}>
        <p>Transcendence: The Duel of Eternity</p>
        <p>
          Objective: Control your ethereal paddle to strike the orb of destiny
          and score points by sending it past the defenses of the ancient
          opponent.
        </p>
        <p>
          Controls: Use the ArrowUp key to elevate your paddle towards the
          heavens. Use the ArrowDown key to lower it towards the abyss.
        </p>
        Scoring: Earn a point each time you direct the orb past the guardian
        paddle of the old gods. The tally of souls is displayed at the nexus of
        the arena.
        <p>
          Mystical Elements: At times, the orb of transcendence (radiant yellow)
          may manifest. Harness its power! In sacred versions, remain vigilant
          for arcane relics that can alter the fate of the duel.
        </p>
        <p>
          Entering the Arena: Click on "Commune with Random" or "Commune with
          Random Plus" to challenge a worthy adversary. The "Plus" rite unveils
          deeper mysteries. Severing the Connection:
        </p>
        Should you desire to retreat or sever the bond of the duel, invoke the
        provided rituals.
        <p>
          Or just short one: Transcendence: Duel of Eternity | Elevate | Lower |
          Score by Orb | Mystic Orb
        </p>
      </Box>
    </div>
  );
};

export default Game;
