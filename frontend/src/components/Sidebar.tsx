import React, { useEffect } from "react";
import { SunIcon, MoonIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  List,
  ListItem,
  ListIcon,
  Box,
  Button,
  useToast,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { WebsocketContext } from "../components/Context/WebsocketContexts";
import { useNavigate } from "react-router-dom";
import UpdateUser from "./ControlPanel/UpdateUser";
import FileUpload from "./ControlPanel/FileUpload";

interface Opponent {
  gameType: string;
  playerOneId: number;
  playeroneName: string;
  playerTwoId: number;
  playerTwoName: string;
  timestamp: number;
}
//
// const InitialLoginPrompt = () => {
    //  const navigate = useNavigate();
//   const toast = useToast();
  
//   return (
    // <Box p={4} color="white" bg="blue.500" borderRadius="md">
      {/* <p> */}
        {/* Welcome! Change your avatar and username in the account section. */}
      {/* </p> */}
    //   <UpdateUser/>
    //   <FileUpload />
      {/* <Button */}
        // mt={2}
        // size="sm"
        // colorScheme="green"
        // onClick={() => {
        //   navigate("/profile");
        //   toast.closeAll();
        // }}
    //   >
        {/* Got it! */}
      {/* </Button> */}
    {/* </Box> */}
//   );
// };
// 
export const Sidebar = () => {
  const socketIo = useContext(WebsocketContext);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    socketIo.on("GameRequest", (data: Opponent) => {
      toast({
        title: `Game Request from ${data.playeroneName}`,
        description: `Would you like to join the game?`,
        status: "info",
        duration: null,
        isClosable: true,
        position: "top-right",
        variant: "solid",
        colorScheme: "teal",
        render: ({ onClose }) => (
          <Box color="white">
            Player {data.playeroneName} wants to play with you.
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => {
                socketIo.emit("acceptGameRequest", data);
                onClose();
                data.gameType === "extended"
                  ? navigate("/gamePlus")
                  : navigate("/game");
              }}
            >
              Join
            </Button>
            <Button size="sm" colorScheme="red" onClick={onClose}>
              Close
            </Button>
          </Box>
        ),
      });
    });

    socketIo.on("EndGame", (data: String) => {
      toast({
        title: `Game Over`,
        description: `Have a nice day`,
        status: "info",
        duration: null,
        isClosable: true,
        position: "top-right",
        variant: "solid",
        colorScheme: "teal",
        render: ({ onClose }) => (
          <Box color="white">
            {data}
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => {
                console.log("Game Over");
                onClose();
                window.location.href = "/chat";
              }}
            >
              Ok
            </Button>
          </Box>
        ),
      });
    });

    socketIo.on('welcome', () => {
        console.log("Welcome received");
    toast({
    title: 'Welcome!',
    description: 'Welcome traveller! Change your avatar and username in the account section!',
    status: 'info',
    duration: null,
    isClosable: true,
    position: 'top-right',
    variant: 'subtle',
    colorScheme: 'teal',
    render: ({ onClose }) => (
        <Box color="white">
          Welcome! Change your avatar and username in the account section.
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => {
              console.log("Welcome received");
              onClose();
              window.location.href = "/profile";
            }}
          >
            Ok
          </Button>
        </Box>
      ),
    });
    });

    return () => {
      socketIo.off("GameRequest");
      socketIo.off("EndGame");
      socketIo.off('welcome');
    };
  }, [toast, socketIo]);

  return (
    <Box bgSize="cover" bgPosition="center" bgRepeat="no-repeat">
      <List
        color="lavender"
        fontSize="2.3em"
        spacing={4}
        style={{ fontFamily: "'IM Fell English SC', serif" }}
      >
        <ListItem>
          <NavLink to="/profile">
            <ListIcon
              as={SunIcon}
              color="#FFCDB2"
              style={{ fontFamily: "'IM Fell English SC', serif" }}
            />
            Account
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/chat">
            <ListIcon
              as={MoonIcon}
              color="lightblue"
              style={{ fontFamily: "'IM Fell English SC', serif" }}
            />
            Chat
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/game">
            <ListIcon
              as={TriangleUpIcon}
              color="palegreen"
              style={{ fontFamily: "'IM Fell English SC', serif" }}
            />
            Game
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/gamePlus">
            <ListIcon
              as={TriangleUpIcon}
              color="palegreen"
              style={{ fontFamily: "'IM Fell English SC', serif" }}
            />
            Game+
          </NavLink>
        </ListItem>
      </List>
    </Box>
  );
};
