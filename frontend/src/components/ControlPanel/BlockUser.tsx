import { useState } from "react";

const BlockUser: React.FC = () => {
	const [username, setUsername] = useState<string>("");
  const validUsernamePattern = /^[a-zA-Z0-9_]*$/;
	const handleBlockUser = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/block/user/${username}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);
			if (response.status === 400) {
				alert(`You cannot block/unblock yourself`);
				return;
			}
			if (response.status === 404) {
				alert(`User ${username} doesn't exist`);
				return;
			}
			if (response.status === 409) {
				alert(`Already blocked User: ${username}`);
				return;
			}

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.text();
			alert(`You blocked ${username}`);
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
				placeholder="Enter username to block"
				value={username}
        onChange={handleUsernameChange}
        maxLength={15}
			/>
			<button onClick={handleBlockUser}>Block user</button>
		</div>
	);
};

export default BlockUser;
