import React, { useState } from "react";

const DeleteFriend: React.FC = () => {
	const [friendName, setFriendName] = useState("");

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

	return (
		<div>
			<input
				type="text"
				placeholder="Enter friend's username"
				value={friendName}
				onChange={(e) => setFriendName(e.target.value)}
			/>
			<button onClick={handleDelete}>Delete Friend</button>
		</div>
	);
};

export default DeleteFriend;
