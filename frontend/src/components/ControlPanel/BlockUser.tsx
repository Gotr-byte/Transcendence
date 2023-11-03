import { useState } from "react";

const BlockUser: React.FC = () => {
	const [username, setUsername] = useState<string>("");

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

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.text();
			console.log("Friend added:", data);
		} catch (error) {
			console.error("There was a problem adding the friend:", error);
		}
		window.location.reload();
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Enter username to block"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<button onClick={handleBlockUser}>Block user</button>
		</div>
	);
};

export default BlockUser;
