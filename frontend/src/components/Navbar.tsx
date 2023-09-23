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

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showUser, setShowUser] = useState(false);

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
      {/* <HStack spacing="10px" width="100px" height="100px"> */}
      <HStack spacing="10px" height="120px">
        {showUser && user?.username && <Text color="silver" fontSize={'30px'}>{user.username}</Text>}
        {showUser && user?.username && (
          <Avatar name="avatar" src={user.avatar} background="purple">
          </Avatar>
        )}
        {isLoggedIn ? (
          <button style={{ color: 'silver' , fontSize:'30px'}}  onClick={handleLogout}>Logout</button>
        ) : (
          <button style={{ color: 'silver', fontSize:'30px', alignItems:"right"}} 
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
