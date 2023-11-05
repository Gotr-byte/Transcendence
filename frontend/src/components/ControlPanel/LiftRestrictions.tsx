import { useState } from "react";

const LiftRestrictions: React.FC = () => {
	const [id, setId] = useState<number>(0); // id is now a number
	const [username, setUsername] = useState<string>("");
	const validUsernamePattern = /^[a-zA-Z0-9_]*$/;
	const banHandler = async () => {
		try {
			const response = await fetch(
				`${
					import.meta.env.VITE_API_URL
				}/chat/admin/id/${id}/${username}/liberate`,
				{
					method: "DELETE",
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
					`You are not authorized to lift this users restriction. You have to be admin or owner`
				);
				return;
			}

			if (response.status === 409) {
				alert(
					`There is no restriction for ${username}`
				);
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
			alert(
				`Restriction: Restriction lifted from ${username}`
			);
		} catch (error) {
			console.error("There was a problem enabling restriction", error);
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
			<button onClick={banHandler}>LiftRestriction</button>
		</div>
	);
};

export default LiftRestrictions;
