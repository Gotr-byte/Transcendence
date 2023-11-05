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


			if (response.status === 400) {
				alert(
					`What do you think? We dont have that much channels ;)`
				);
				return;
			}

			if (response.status === 401) {
				alert(
					`You are not authorized to add users to this channel. You have to be admin or owner`
				);
				return;
			}

			if (response.status === 403) {
				alert(
					`${username} is BANNED on this channel`
				);
				return;
			}

			if (response.status === 404) {
				alert(`Channel ID or username doesnt exist on the server`);
				return;
			}

			if (response.status === 409) {
				alert(`${username} is already member of that channel`);
				return;
			}
	
			// Error handling
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Log the response
			const data = await response.text();
			alert(`${username} is now member of channel Id: ${id}`);
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
				ChannelId=
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

			<button onClick={inviteHandler}>Add to Channel</button>
		</div>
	);
};

export default PrivateChannelInvitation;
