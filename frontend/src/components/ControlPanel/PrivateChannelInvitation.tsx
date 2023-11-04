import React, { useState } from "react";

const PrivateChannelInvitation: React.FC = () => {
	// Initialize state
	const [id, setId] = useState<number>(0); // id is now a number
	const [username, setUsername] = useState<string>("");
	const validTitlePattern = /^[a-zA-Z0-9_]*$/;

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
			console.error("There was a problem creating the channel:", error);
		}
	};

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
			if (value === "" || validTitlePattern.test(value)) {
				setUsername(value);
			}
		};

		const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			// Check if the value is not empty and is a number within the range 0-99
			if (value === '' || (Number(value) >= 0 && Number(value) <= 99)) {
				setId(Number(value));
			}
		};

	return (
		<div>
			<label>
				ChatId=
				<input
					style={{ width: "20px" }}
					type="number" // Input type is now "number"
					placeholder="Enter chat id"
					value={id}
					onChange={handleIdChange} // Convert string to number
				/>
			</label>

			<input
				type="text"
				placeholder="Enter username"
				value={username}
				onChange={handleUsernameChange}
			/>

			<button onClick={inviteHandler}>Invite</button>
		</div>
	);
};

export default PrivateChannelInvitation;
