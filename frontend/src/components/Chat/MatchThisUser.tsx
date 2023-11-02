import { WebsocketContext } from "../Context/WebsocketContexts";
import {Button} from "@chakra-ui/react"
import {useContext} from "react";

export const MatchThisUser: React.FC<SendDirectMessageProps> = ({
  username,
}) => {
  const socket = useContext(WebsocketContext);

    const redirectToGame = () => {
        window.location.href = 'http://localhost:5173/game';
        socket.emit("matchThisUser", username);
    };

    return (
      <Button variant="solid" size="xl" onClick={redirectToGame}>
      G
     </Button>
    );
}

export default MatchThisUser;
