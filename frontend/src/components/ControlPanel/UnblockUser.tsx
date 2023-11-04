import { useState } from "react";

const UnblockUser: React.FC = () => {
	const [username, setUsername] = useState<string>("");

  const validUsernamePattern = /^[a-zA-Z0-9_]*$/;

	const handleUnblockUser = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/block/user/${username}`,
				{
					method: "DELETE",
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
			console.log("Friend unblocked:", data);
		} catch (error) {
			console.error("There was a problem adding the friend:", error);
		}
		window.location.reload();
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
				placeholder="Enter username to unblock"
				value={username}
				onChange={handleUsernameChange}
				maxLength={15}
			/>
			<button onClick={handleUnblockUser}>Unblock user</button>
		</div>
	);
};

export default UnblockUser;
