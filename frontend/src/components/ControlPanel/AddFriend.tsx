import React, { useState } from "react";

const AddFriend: React.FC = () => {
	const [username, setUsername] = useState<string>("");


	const validUsernamePattern = /^[a-zA-Z0-9_]*$/;

	const handleAddFriend = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/friends/${username}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			if (response.status === 400) {
				alert(`You cannot befriend yourself`);
				return;
			}
			if (response.status === 404) {
				alert(`User ${username} doesn't exist`);
				return;
			}
			if (response.status === 409) {
				alert(`Already send a friend request to ${username}`);
				return;
			}
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.text();
			console.log("Friend added:", data);
			window.location.reload();
		} catch (error) {
			console.error("There was a problem adding the friend:", error);
		}
	};

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || validUsernamePattern.test(value)) {
      setUsername(value);
    }
  };


	return (
		<div>
			<input
				type="text"
				placeholder="Enter friend's username"
				value={username}
				onChange={handleUsernameChange}
				maxLength={15}
			/>
			<button onClick={handleAddFriend}>Send friend request </button>
		</div>
	);
};

export default AddFriend;
