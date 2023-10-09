import { useEffect, useState, useContext} from "react";
import {
  Avatar,
  Flex,
  Text,
  Heading,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import { TwoFAComponent } from './TwoFAComponent';  // Import the TwoFAComponent
import { WebsocketContext } from './Context/WebsocketContexts';




interface User {
  id: string;
  username: string;
  isOnline: boolean;
  avatar: string;
  is2FaActive: boolean;  // Assuming the API returns this field
  is2FaValid?: boolean;
}

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showUser, setShowUser] = useState(false);
  const socket = useContext(WebsocketContext);


  const fetchUserData = () => {
    fetch(`${import.meta.env.VITE_API_URL}/profile`, {
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
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setIsLoggedIn(false);
      });
  };

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      credentials: "include",
    })
    .then((response) => response.json());
    setShowUser(false);
    setIsLoggedIn(false);
    socket.off('connect');
  };

  // Function to handle successful 2FA verification
  const handle2FASuccess = () => {
    console.log('2FA verified successfully.');
    // Redirect the user to the main page or reload the current page
    // window.location.href = '/main-page-url'; 
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  let handleLogin = () => {
    (window.location.href = `${import.meta.env.VITE_API_URL}/auth/42/login`);
    socket.on("connect", () => {
      console.log("Connected!");
    });

  }

  return (
    <Flex as="nav" p="10x" mb="40px" alignItems="center" gap="10px">
      <Heading as="h1" color="silver" style={{ fontFamily: "'IM Fell English SC', serif" }}>
        Transcendence
      </Heading>
      <Spacer />
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
            onClick={ handleLogin } 
          >
            Login
          </button>
        )}
      </HStack>

      {/* Conditionally render the TwoFAComponent if 2FA is active for the logged-in user */}
      {/* {isLoggedIn && user?.is2FaActive && !(user?.is2FaValid) &&(
        <TwoFAComponent onVerify={handle2FASuccess} />
    )} */}
        {/* {isLoggedIn && (<TwoFAComponent onVerify={handle2FASuccess}/>)} */}

    </Flex>
  );
};
