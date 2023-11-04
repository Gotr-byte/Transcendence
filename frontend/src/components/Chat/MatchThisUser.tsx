import { WebsocketContext } from "../Context/WebsocketContexts";
import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

interface SendDirectMessageProps {
  username: string;
}

export const MatchThisUser: React.FC<SendDirectMessageProps> = ({
  username,
}) => {
  const socket = useContext(WebsocketContext);
  const navigate = useNavigate();

  const redirectToGame = () => {
    // Prepare the data to send
    const dataToSend = {
      name: username,
      game: ""
    };
  
    // Emit the socket event with the object
    socket.emit("matchThisUser", dataToSend);
  
    // Redirect to the game page
    navigate('/game');
  };

  return (
    <Button variant="solid" size="xl" onClick={redirectToGame}>
      G
    </Button>
  );
}

export default MatchThisUser;
