import { useState } from "react";

interface Decree {
	restrictionType: string;
	// duration: string;
}

const LiftRestrictions: React.FC = () => {
	const [id, setId] = useState<number>(0); // id is now a number
	const [username, setUsername] = useState<string>("");
	const [restrictionType, setRestrictionType] = useState<string>("BANNED");

	const [error, setError] = useState<string | null>(null);

	const decreeData: Decree = {
		restrictionType,
	};
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
					body: JSON.stringify(decreeData),
				}
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			console.log("Channel created:", data);
		} catch (error) {
			setError(`There was a problem enablig restriction ${error}`);
			console.error("There was a problem enabling restriction", error);
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
					onChange={(e) => setId(Number(e.target.value))}
				/>
			</label>
			<input
				type="text"
				placeholder="Enter username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<button onClick={banHandler}>LiftRestriction</button>
		</div>
	);
};

export default LiftRestrictions;
