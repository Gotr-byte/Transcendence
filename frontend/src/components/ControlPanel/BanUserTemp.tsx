import { useState } from "react";

interface Decree {
	restrictionType: string;
	duration?: string;
}

const BanUserTemp: React.FC = () => {
	const [id, setId] = useState<number>(0);
	const [username, setUsername] = useState<string>("");
	const [restrictionType, setRestrictionType] = useState<string>("BANNED");
	const [duration, setDuration] = useState<string>("");
	const validUsernamePattern = /^[a-zA-Z0-9_]*$/;

	const banHandler = async () => {
		// Construct the payload inside the handler
		const payload: Decree = {
			restrictionType,
			...(duration && { duration }), // Only include duration if it is not empty
		};

		try {
			const response = await fetch(
				`${
					import.meta.env.VITE_API_URL
				}/chat/admin/id/${id}/${username}/restrict`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(payload), // Use the conditionally constructed payload
				}
			);

			if (response.status === 400) {
				alert(`What you you think? We dont have that much channels ;)`);
				return;
			}

			if (response.status === 401) {
				alert(
					`You are not authorized to restrict users on this channel. You have to be admin or owner`
				);
				return;
			}

			if (response.status === 404) {
				alert(`Username: ${username} or Channel ID: ${id} doesnt exist`);
				return;
			}

			if (response.status === 409) {
				alert(`Username: ${username} is already restricted`);
				return;
			}

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			if (!duration) alert(`${restrictionType} ${username} indefinitely`);
			else alert(`${restrictionType} ${username} until ${duration}`);
			window.location.reload();
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
			<label>
				Restriction Type:
				<select
					value={restrictionType}
					onChange={(e) => setRestrictionType(e.target.value)}
				>
					<option value="BANNED">BANNED</option>
					<option value="MUTED">MUTED</option>
				</select>
			</label>
			<label>
				No date for indefinite restriciton:
				<input
					type="datetime-local"
					value={duration}
					onChange={(e) => setDuration(e.target.value)}
				/>
			</label>
			<button onClick={banHandler}>EnableRestriction</button>
		</div>
	);
};

export default BanUserTemp;
