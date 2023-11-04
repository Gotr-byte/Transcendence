import React, { useEffect } from 'react';
import { SunIcon, MoonIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { List, ListItem, ListIcon, Box, Button, useToast } from "@chakra-ui/react";
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { WebsocketContext } from '../components/Context/WebsocketContexts';

interface Opponent {
    playerOneId: number;
    playeroneName: string;
    playerTwoId: number;
    playerTwoName: string;
    timestamp: number;
}

export const Sidebar = () => {
    const socketIo = useContext(WebsocketContext);
    const toast = useToast();

    useEffect(() => {
        socketIo.on('GameRequest', (data: Opponent) => {
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
                        <Button size="sm" colorScheme="green" onClick={() => {
                            onClose();
                            history.push('/game'); // this replaces window.location.href
                            socketIo.emit("acceptGameRequest", data);
                        }}>Join</Button>
                        {/* <Button size="sm" colorScheme="green" onClick={() => { console.log('Joining Game'); onClose(); window.location.href = '/gamePlus'; socketIo.emit("matchThisUser", data.playeroneName);}}>Join</Button> */}

                        <Button size="sm" colorScheme="red" onClick={onClose}>Close</Button>
                    </Box>
                ),
            });
        });

        socketIo.on('EndGame', (data: String) => {
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
                        <Button size="sm" colorScheme="green" onClick={() => { console.log('Game Over'); onClose(); window.location.href = '/chat';}}>Ok</Button>
                    </Box>
                ),
            });
        });

        return () => {
            socketIo.off('GameRequest');
        };
    }, [toast, socketIo]);

    return (
        <Box bgSize="cover" bgPosition="center" bgRepeat="no-repeat">
            <List color="lavender" fontSize="2.3em" spacing={4} style={{ fontFamily: "'IM Fell English SC', serif" }}>
                <ListItem>
                    <NavLink to="/profile">
                        <ListIcon as={SunIcon} color="#FFCDB2" style={{ fontFamily: "'IM Fell English SC', serif" }} />
                        Account
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to="/chat">
                        <ListIcon as={MoonIcon} color="lightblue" style={{ fontFamily: "'IM Fell English SC', serif" }} />
                        Chat
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to="/game">
                        <ListIcon as={TriangleUpIcon} color="palegreen" style={{ fontFamily: "'IM Fell English SC', serif" }} />
                        Game
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to="/gamePlus">
                        <ListIcon as={TriangleUpIcon} color="palegreen" style={{ fontFamily: "'IM Fell English SC', serif" }} />
                        Game+
                    </NavLink>
                </ListItem>
            </List>
        </Box>
    )
}
