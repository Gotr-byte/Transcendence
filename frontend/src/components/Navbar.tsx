import {
  Avatar,
  Flex,
  Text,
  Heading,
  Spacer,
  HStack,
  AvatarBadge,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  isOnline: boolean;
  avatar: string;
  is2FaActive: boolean;
}

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showUser, setShowUser] = useState(false);

  const fetchUserData = () => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setShowUser(true);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Flex as="nav" p="10x" mb="40px" alignItems="center" gap="10px">
      <Heading as="h1" color="black">
        Transcendence
      </Heading>
      <Spacer />

      <HStack spacing="10px">
      {showUser && user?.username && (
   <Text>{user.username}</Text>
 )}
       
        {showUser && user?.username && (
        <Avatar name="mario" src={user.avatar} background="purple">
          <AvatarBadge width="1.3em" bg="teal.500">
            <Text fontSize="xs" color="white">
              10
            </Text>
          </AvatarBadge>
        </Avatar>
)}

<button
          onClick={() =>
            (window.location.href = "http://localhost:4000/auth/42/login")
          }
        >
          Login
        </button>
      </HStack>
    </Flex>
  );
};
