import React, { useState } from "react";

interface Role {
	role: string;
}

const DesignateAdmin: React.FC = () => {
	const [id, setId] = useState<number>(0);
	const [username, setUsername] = useState<string>("");
	const [role, setRole] = useState<string>("ADMIN");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null); // New state variable for success message
  const validUsernamePattern = /^[a-zA-Z0-9_]*$/;
	const designateHandler = async () => {
		if (id <= 0 || username === "") {
			setError("Please provide valid ID and username.");
			return;
		}

		const roleData: Role = { role };

		try {
			const response = await fetch(
				`${
					import.meta.env.VITE_API_URL
				}/chat/admin/id/${id}/${username}/update-role`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(roleData),
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
					`You are not authorized to change this users role. You have to be admin or owner`
				);
				return;
			}

			if (response.status === 409) {
				alert(`${username} already has role ${role}`);
				return;
			}

			if (response.status === 404) {
				alert(`Channel ID or username doesnt exist on the server`);
				return;
			}

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.text();
			console.log("Designated admin:", data);
			alert(`${role} designated successfully to ${username} on channel Id: ${id}`); // Setting success message on successful API response
		} catch (error) {
			console.error("There was a problem designating admin:", error);
		}
	};
	const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Check if the value is not empty and is a number within the range 0-99
		if (value === '' || (Number(value) >= 0 && Number(value) <= 99)) {
			setId(Number(value));
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
			<label>
				ChannelId=
				<input
					style={{ width: "20px" }}
					type="number"
					placeholder="Enter chat id"
					value={id}
					onChange={handleIdChange}
				/>
			</label>
			<input
				type="text"
				placeholder="Enter username"
				value={username}
				onChange={handleUsernameChange}
				maxLength={15}
			/>
			<label>
				Role:
				<select value={role} onChange={(e) => setRole(e.target.value)}>
					<option value="ADMIN">ADMIN</option>
					<option value="USER">USER</option>
				</select>
			</label>
			<button onClick={designateHandler}>DesignateRole</button>
			{error && <div style={{ color: "red" }}>{error}</div>}
			{success && <div style={{ color: "green" }}>{success}</div>}{" "}
			{/* Display success message when operation is successful */}
		</div>
	);
};

export default DesignateAdmin;
