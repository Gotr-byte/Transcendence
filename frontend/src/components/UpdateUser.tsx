import { Avatar, Flex, Text, Heading, Spacer, HStack, AvatarBadge, Input, Button, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from "react";

interface User {
    id: string;
    username: string;
    isOnline: boolean;
    avatar: string;
    is2FaActive: boolean;
}

export const UpdateUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [newUsername, setNewUsername] = useState("");
    const [newAvatar, setNewAvatar] = useState(""); // State to hold the new avatar URL from the input

    const toast = useToast();

    const fetchUserData = () => {
        fetch("http://localhost:4000/profile", {
            credentials: "include",
        })
            .then(response => response.json())
            .then(data => {
                setUser(data);
                setShowUser(true);
            });
    };

    const updateUsername = () => {
        fetch(`http://localhost:4000/users/${user?.id}`, { // Assuming user id is the required path parameter
            method: 'PATCH',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: newUsername,
                avatar: newAvatar
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                setUser(data); // Assuming the server returns the updated user data
                toast({
                    title: 'Profile updated',
                    description: 'Your profile has been updated successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch(error => {
                toast({
                    title: 'Error',
                    description: 'Failed to update profile.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <Flex as="nav" p="10x" mb="40px" alignItems="center" gap="10px" flexDirection="column">
            <Heading as="h1" color="black">Transcendence</Heading>
            <Spacer />

            {showUser && user?.username && (
                <>
                    <HStack spacing="10px">
                        <Avatar name={user.username} src={user.avatar} background="purple">
                            <AvatarBadge width="1.3em" bg="teal.500">
                                <Text fontSize="xs" color="white">10</Text>
                            </AvatarBadge>
                        </Avatar>
                        <Text>{user.username}</Text>
                    </HStack>

                    {/* Add a form for updating the username and avatar */}
                    <Flex my={4} direction="column" width="300px" gap="16px">
                        <Input placeholder="Enter new username" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                        <Input placeholder="Enter new avatar URL" value={newAvatar} onChange={e => setNewAvatar(e.target.value)} />
                        <Button colorScheme="purple" onClick={updateUsername}>Update Profile</Button>
                    </Flex>
                </>
            )}
        </Flex>
    );
}
