import { Button } from "@chakra-ui/react";

interface AcceptButtonProps {
	username: string;
}

const AcceptButton: React.FC<AcceptButtonProps> = ({ username }) => {
	const acceptRequest = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/friends/${username}`,
				{
					method: "PATCH",
					credentials: "include",
				}
			);

			if (response.ok) {
				alert("Friend request accepted.");
			} else {
				throw new Error("Failed to accept friend request.");
			}
		} catch (error) {
			console.error("An error occurred:", error);
		}
		window.location.reload();
	};

	return (
		<Button onClick={acceptRequest} size="xs">
			Accept
		</Button>
	);
};

export default AcceptButton;
