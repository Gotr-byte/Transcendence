import React, { useState } from "react";

const PrivateChannelInvitation: React.FC = () => {
	// Initialize state
	const [id, setId] = useState<number>(0); // id is now a number
	const [username, setUsername] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	// Function to handle editing the channel
	const inviteHandler = async () => {
		// Prepare the channel data

		try {
			// Make the API call to edit the channel
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/chat/admin/id/${id}/${username}/add`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			// Error handling
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Log the response
			const data = await response.text();
			console.log("Channel created:", data);
		} catch (error) {
			setError(`There was a problem creating the channel: ${error}`);
			console.error("There was a problem creating the channel:", error);
		}
	};

	// JSX
	return (
		<div>
			<label>
				ChatId=
				<input
					style={{ width: "20px" }}
					type="number" // Input type is now "number"
					placeholder="Enter chat id"
					value={id}
					onChange={(e) => setId(Number(e.target.value))} // Convert string to number
				/>
			</label>

			<input
				type="text"
				placeholder="Enter username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>

			<button onClick={inviteHandler}>Invite</button>
		</div>
	);
};

export default PrivateChannelInvitation;
