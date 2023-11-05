import { WebsocketContext } from "../Context/WebsocketContexts";
import {Button} from "@chakra-ui/react"
import {useContext, useState, useEffect} from "react"

export const JoinRandom: React.FC = () => {

const socket = useContext(WebsocketContext);
useEffect(() => {
  const eventName = `matchmaking`
  return () => {
    console.log("Unregistering Events...");
    socket.off(eventName);
  };
}, [socket]);
const onSubmit = () => {
  socket.emit("match-random");
}
  return (
    <div>
    <Button variant="solid" size="xl" onClick={onSubmit}>
       Join Random Game
      </Button>
    </ div>
       
    );
};

export default JoinRandom;
