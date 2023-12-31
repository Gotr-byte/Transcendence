import { WebsocketContext } from "../Context/WebsocketContexts";
import {Button} from "@chakra-ui/react"
import {useContext, useState, useEffect} from "react"

type MatchmakingPayload = {
  content: string;
};

export const JoinRandomPlus: React.FC = () => {

const socket = useContext(WebsocketContext);
const [receivedPrompts, setReceivedPrompts] = useState<
MatchmakingPayload[]
>([]);
useEffect(() => {
  const eventName = `matchmaking`
  socket.on(eventName, (newMessage: MatchmakingPayload) => {
    setReceivedPrompts((prev) => [...prev, newMessage]);
  });
  return () => {
    console.log("Unregistering Events...");
    socket.off(eventName);
  };
}, [socket]);
const onSubmit = () => {
  socket.emit("match-random", "extended");
}
  return (
    <div>
    <Button variant="solid" size="xl" onClick={onSubmit}>
       Join Random Game Plus
      </Button>
    </ div>
       
    );
};

export default JoinRandomPlus;
