import { WebsocketContext } from "../Context/WebsocketContexts";
import {Button} from "@chakra-ui/react"
import {useContext} from "react";

export const MatchThisUser: React.FC<SendDirectMessageProps> = ({
  username,
}) => {
  const socket = useContext(WebsocketContext);
  const onSubmit = () => {
    socket.emit("matchThisUser", username);
  }
    return (
        <Button variant="solid" size="xl" onClick={onSubmit}>
         G
        </Button>
      );  
};

export default MatchThisUser;
