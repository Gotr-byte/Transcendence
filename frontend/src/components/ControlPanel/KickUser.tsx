import { useState } from "react";

const KickUser: React.FC = () => {
	const [id, setId] = useState<number>(0); // id is now a number
	const [username, setUsername] = useState<string>("");

	const kickHandler = async () => {
		try {
			const response = await fetch(
				`${
					import.meta.env.VITE_API_URL
				}/chat/admin/id/${id}/${username}/kick`,
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
			console.log("Channel created:", data);
		} catch (error) {
			// setError(`There was a problem enablig restriction ${error}`);
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
			<button onClick={kickHandler}>KickUser</button>
		</div>
	);
};

export default KickUser;
