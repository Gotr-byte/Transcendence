import { useEffect, useState, useContext } from "react";
import { Avatar, Flex, Text, Heading, Spacer, HStack } from "@chakra-ui/react";
import { TwoFAComponent } from "./TwoFAComponent"; // Import the TwoFAComponent
import { WebsocketContext } from "./Context/WebsocketContexts";

interface User {
	id: string;
	username: string;
	isOnline: boolean;
	avatar: string;
	is2FaActive: boolean;
	is2FaValid?: boolean;
}

interface NavbarProps {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
	isLoggedIn,
	setIsLoggedIn,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [showUser, setShowUser] = useState(false);
	const [show2FAComponent, setShow2FAComponent] = useState<boolean>(false);
	const socket = useContext(WebsocketContext);

	const setupSocketConnection = (userId: string) => {
		socket.open();
		console.log("Socket Connection Established");
	};


	const check2FAActive = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/2fa/is2faactive`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to check 2FA active status');
      }
      return await response.json();
    } catch (error) {
      console.error("Error checking 2FA active status:", error);
      throw error;
    }
  };

	const check2FAValid = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/2fa/is2favalid`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to check 2FA valid status');
      }
      return await response.json();
    } catch (error) {
      console.error("Error checking 2FA valid status:", error);
      throw error;
    }
  };

	const fetchUserData = () => {
		fetch(`${import.meta.env.VITE_API_URL}/profile`, {
			credentials: "include",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Not logged in");
				}
				return response.json();
			})
			.then((data) => {
				setUser(data);
				setShowUser(true);
				setIsLoggedIn(true);
				setupSocketConnection(data.id);
			})
			.catch((error) => {
				console.error("Fetch error:", error);
				setIsLoggedIn(false);
			});
	};

	async function checkExistingSessions() {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/auth/check-existing-sessions`,
				{
					method: "POST",
					credentials: "include",
				}
			);

			if (!response.ok) {
				throw new Error("Server returned an error");
			}

			const result = await response.json();
			return result.removeThisSession;
		} catch (error) {
			console.error("Network or fetch error:", error);
			return false;
		}
	}

	const validateUser = async () => {
		const is2FaActive = await check2FAActive();
		const is2FaValid = await check2FAValid();

		if (is2FaActive && !is2FaValid) {
			setShow2FAComponent(true);
		} else {
			fetchUserData();
		}
	};

	const checkSession = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/auth/session-status`,
			{
				credentials: "include",
			}
			
		);

		if (!response.ok) {
			if (response.status === 401) {
				return false;
			}
		}

		const message = await response.text();
		return message === "Session Valid";
	};

	async function checkForMultipleSessions(): Promise<boolean> {
		const removeThisSession = await checkExistingSessions();

		if (removeThisSession) {
			alert(
				"Yo are not able to login, you have already an open active session"
			);
			return true;
		}
		return false;
	}

	useEffect(() => {
		const checkLoginStatus = async () => {
			if (!isLoggedIn) {
				const sessionValid = await checkSession();
				if (sessionValid) {
					const multipleSessions = await checkForMultipleSessions();
					if (!multipleSessions) {
						await validateUser();
					}
				}
			} else fetchUserData();
		};

		checkLoginStatus();
	}, []);

	const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        credentials: "include",
      });
      await response.json();
      setShowUser(false);
      setIsLoggedIn(false);
      socket.close();
      console.log("Socket Connection Closed");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


	let handleLogin = () => {
		window.location.href = `${import.meta.env.VITE_API_URL}/auth/42/login`;
	};

	return (
		<Flex as="nav" p="10x" mb="40px" alignItems="center" gap="10px">
			<Heading
				as="h1"
				color="silver"
				style={{ fontFamily: "'IM Fell English SC', serif" }}
			>
				Transcendence
			</Heading>
			<Spacer />
			<HStack spacing="10px" height="120px">
				{showUser && user?.username && (
					<Text color="silver" fontSize={"30px"}>
						{user.username}
					</Text>
				)}
				{showUser && user?.username && (
					<Avatar name="avatar" src={user.avatar} background="purple"></Avatar>
				)}
				{isLoggedIn ? (
					<button
						style={{ color: "silver", fontSize: "30px" }}
						onClick={handleLogout}
					>
						Logout
					</button>
				) : (
					<button
						style={{ color: "silver", fontSize: "30px", alignItems: "right" }}
						onClick={handleLogin}
					>
						Login
					</button>
				)}
			</HStack>
			{show2FAComponent && (
				<TwoFAComponent
					onVerify={() => {
						setShow2FAComponent(false);
						validateUser();
					}}
				/>
			)}
		</Flex>
	);
};
