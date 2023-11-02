import { Button } from "@chakra-ui/react";
import React from "react";

interface AcceptButtonProps {
	username: string; // The username of the user who sent the friend request
}

const AddFriendButton: React.FC<AcceptButtonProps> = ({ username }) => {
	const acceptRequest = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/friends/${username}`,
				{
					method: "POST",
					credentials: "include",
				}
			);

			if (response.ok) {
				alert("Friend request sent.");
			} else {
				throw new Error("Failed to send friend request.");
			}
		} catch (error) {
			console.error("An error occurred:", error);
		}
		// window.location.reload();
	};

	return (
		<Button onClick={acceptRequest} size="xs">
			+
		</Button>
	);
};

export default AddFriendButton;
