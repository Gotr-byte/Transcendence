import { useEffect, useState } from "react";
import {
	useDisclosure,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Input,
	Button,
} from "@chakra-ui/react";

interface TwoFAComponentProps {
	onVerify: () => void;
}

export const TwoFAComponent = ({ onVerify }: TwoFAComponentProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [token, setToken] = useState("");

	const verifyToken = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/2fa/verify`,
				{
					credentials: "include",
					method: "POST",
					headers: {
						Accept: "*/*",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token }),
				}
			);

			const message = await response.text();

			if (response.ok) {
				alert("Token is valid");
				onVerify(); // Call onVerify on successful 2FA verification
			} else if (response.status === 403) {
				console.log(response);
				alert("Token is Invalid");
				setToken("");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		onOpen();
	}, [onOpen]);

	return (
		<AlertDialog
			isOpen={isOpen}
			onClose={onClose}
			leastDestructiveRef={undefined}
			motionPreset="slideInBottom"
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Two Factor Authentication
					</AlertDialogHeader>
					<AlertDialogBody>
						<Input
							value={token}
							onChange={(e) => setToken(e.target.value)}
							placeholder="Enter your token"
						/>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button onClick={onClose}>Cancel</Button>
						<Button colorScheme="green" onClick={verifyToken} ml={3}>
							Verify
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};
