import { WebsocketContext } from "../Context/WebsocketContexts";
import {Button} from "@chakra-ui/react"
import {useContext} from "react";

export const MatchThisUser: React.FC<SendDirectMessageProps> = ({
  username,
}) => {
  const socket = useContext(WebsocketContext);

    const redirectToGame = () => {
        window.location.href = `/game`;
        const dataToSend = {
          name: username,
          game: ""
        };
        socket.emit("matchThisUser", dataToSend);
    };

    return (
      <Button variant="solid" size="xl" onClick={redirectToGame}>
      G
     </Button>
    );
}

export default MatchThisUser;
