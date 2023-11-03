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
    socketIo.on("GameLoop", (data: GameState) => {
      if (data.ball.x !== undefined && data.ball.y !== undefined) {
        setGameState(data);
      }
    });

    socketIo.on("disconnect", () => {
      console.log("Socket.io connection disconnected.");
    });
  }, [socketIo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == "ArrowUp" || event.key == "ArrowDown") {
        console.log(event.key);
        socketIo.emit("keypress", event.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [socketIo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && gameState) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Fill the canvas with white color
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //paddles paddles are blue
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, 50, 240);
        ctx.closePath();
        ctx.beginPath();
        ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, 50, 240);
        ctx.closePath();
        ctx.font = "48px serif";
        ctx.fillText(gameState.score1 + " : " + gameState.score2, 500, 360);
        // Draw the ball in red
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, 2 * Math.PI); // 10 is the radius of the ball
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
        // Draw the  second ball in yellow
        if (gameState.ball2lock) {
          ctx.beginPath();
          ctx.arc(gameState.ball2.x, gameState.ball2.y, 10, 0, 2 * Math.PI); // 10 is the radius of the ball
          ctx.fillStyle = "yellow";
          ctx.fill();
          ctx.closePath();
        }
        if (gameState.fox.isUnlocked) {
          ctx.beginPath();
          ctx.arc(
            gameState.fox.pos.x,
            gameState.fox.pos.y,
            gameState.fox.hasSizeOf,
            0,
            2 * Math.PI
          ); // 10 is the radius of the ball
          ctx.fillStyle = "orange";
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
