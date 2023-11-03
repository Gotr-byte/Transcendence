import { WebsocketContext } from "../Context/WebsocketContexts";
import {Button} from "@chakra-ui/react"
import {useContext} from "react";

export const MatchThisUserGamePlus: React.FC<SendDirectMessageProps> = ({
  username,
}) => {
  const socket = useContext(WebsocketContext);

    const redirectToGame = () => {
        window.location.href = `/gamePlus`;
        socket.emit("matchThisUser", username);
    };

    return (
      <Button variant="solid" size="xl" onClick={redirectToGame}>
      G+
     </Button>
    );
}

export default MatchThisUserGamePlus;
