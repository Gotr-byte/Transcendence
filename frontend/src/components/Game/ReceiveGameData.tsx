import { useState, useEffect, useContext } from "react";
import { WebsocketContext } from "../Context/WebsocketContexts";
import { Box, Heading, Text } from "@chakra-ui/react";

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

export const ReceivedGameData: React.FC = () => {
    const [receivedFrame, setReceivedFrame] = useState<GameState>({
        paddle1: { x: 0, y: 0 },
        paddle2: { x: 0, y: 0 },
        ball: { x: 0, y: 0 },
        score1: 0,
        score2: 0,
    });

    const socket = useContext(WebsocketContext);

    useEffect(() => {
        const eventName = `GameLoop`;
        socket.on(eventName, (newFrame: GameState) => {
            setReceivedFrame(newFrame);
        });
        return () => {
            console.log("Unregistering Events...");
            socket.off(eventName);
        };
    }, [socket]);

    return (
        <Box bgColor="white" p="5" shadow="md" borderRadius="md" w="md" mx="auto" mt="6">
            <Heading mb="4">Game State</Heading>
            
            <Heading size="md" mb="2">Paddle 1</Heading>
            <Text>X: {receivedFrame.paddle1.x}</Text>
            <Text>Y: {receivedFrame.paddle1.y}</Text>

            <Heading size="md" mb="2" mt="4">Paddle 2</Heading>
            <Text>X: {receivedFrame.paddle2.x}</Text>
            <Text>Y: {receivedFrame.paddle2.y}</Text>

            <Heading size="md" mb="2" mt="4">Ball</Heading>
            <Text>X: {receivedFrame.ball.x}</Text>
            <Text>Y: {receivedFrame.ball.y}</Text>

            <Heading size="md" mb="2" mt="4">Scores</Heading>
            <Text>Score 1: {receivedFrame.score1}</Text>
            <Text>Score 2: {receivedFrame.score2}</Text>
        </Box>
    );
}

export default ReceivedGameData;
