import React, { useState } from "react";

const DeleteFriend: React.FC = () => {
	const [friendName, setFriendName] = useState("");

	const validUsernamePattern = /^[a-zA-Z0-9_]*$/;
	const handleDelete = async () => {
		if (!friendName) {
			console.error("Friend name cannot be empty");
			return;
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/friends/${friendName}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);

			if (response.status === 404) {
				alert(`User: '${friendName}' doesn't exist or you were no friends`);
				return;
			}

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			alert(`${friendName} was successfully unfriended`);
			window.location.reload();
			setFriendName("");
		} catch (error) {
			console.error(
				`There was a problem deleting the friend ${friendName}`,
				error
			);
		}
	};

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
			if (value === "" || validUsernamePattern.test(value)) {
				setFriendName(value);
			}
		};

	return (
		<div>
			<input
				type="text"
				placeholder="Enter friend's username"
				value={friendName}
				onChange={handleUsernameChange}
        maxLength={15}
				/>
			<button onClick={handleDelete}>Delete Friend</button>
		</div>
	);
};

export default DeleteFriend;
