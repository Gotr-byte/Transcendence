import { useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  Text,
  Heading,
  Spacer,
  HStack,
} from "@chakra-ui/react";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state variable

  const fetchUserData = () => {
    fetch(`${process.env.API_URL}/profile`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Not logged in');
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setShowUser(true);
        setIsLoggedIn(true); // Update login status
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setIsLoggedIn(false); // Set isLoggedIn to false if the request fails
      });
  };

  // Log out function
  const handleLogout = () => {
    fetch(`${process.env.API_URL}/auth/logout`, {
  credentials: "include",
})
  .then((response) => response.json())
    setShowUser(false);
    setIsLoggedIn(false); // Update login status
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Flex as="nav" p="10x" mb="40px" alignItems="center" gap="10px">
      <Heading as="h1" color="silver" style={{ fontFamily: "'IM Fell English SC', serif" }}>
        Transcendence
      </Heading>
      <Spacer />
      <HStack spacing="10px">
        {showUser && user?.username && <Text color="silver" >{user.username}</Text>}
        {showUser && user?.username && (
          <Avatar name="avatar" src={user.avatar} background="purple">
          </Avatar>
        )}
        {isLoggedIn ? (
          <button style={{ color: 'silver' }}  onClick={handleLogout}>Logout</button>
        ) : (
          <button style={{ color: 'silver' }} 
            onClick={() =>
              (window.location.href = `${process.env.API_URL}/auth/42/login`)
            }
          >
            Login
          </button>
        )}
      </HStack>
    </Flex>
  );
};
