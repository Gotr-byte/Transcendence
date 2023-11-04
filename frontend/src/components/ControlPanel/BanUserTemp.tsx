import { useState } from "react";

interface Decree {
	restrictionType: string;
	duration: string;
}

const BanUserTemp: React.FC = () => {
	const [id, setId] = useState<number>(0); // id is now a number
	const [username, setUsername] = useState<string>("");
	const [restrictionType, setRestrictionType] = useState<string>("BANNED");
	const [duration, setDuration] = useState<string>("");
	const validUsernamePattern = /^[a-zA-Z0-9_]*$/;

	const decreeData: Decree = {
		restrictionType,
		duration
	};
	const banHandler = async () => {
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
					body: JSON.stringify(decreeData),
				}
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			console.log("Restriction decreed:", data);
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
				ChatId=
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
				Duration (eg. 2023-11-07T10:07:07.000Z):
				<input
					 type="text"
					 placeholder="YYYY-MM-DDTHH:MM:SS:"
					 value={duration}
					 onChange={(e) => setDuration(e.target.value)}
					 maxLength={24}
				/>
			 </label>
			<button onClick={banHandler}>EnableRestriction</button>
		</div>
	);
};

export default BanUserTemp;
