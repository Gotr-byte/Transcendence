import { useState } from "react";

const KickUser: React.FC = () => {
	const [id, setId] = useState<number>(0); // id is now a number
	const [username, setUsername] = useState<string>("");

	const kickHandler = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/chat/admin/id/${id}/${username}/kick`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			console.log(response.status);
			if (response.status === 400) {
				alert(`What do you think? We dont have that much channels ;)`);
				return;
			}

			if (response.status === 401) {
				alert(
					`You are not authorized to kick user. You have to be admin or owner`
				);
				return;
			}

			if (response.status === 404) {
				alert(`Channel ID or username doesnt exist on the server`);
				return;
			}

			if (response.status === 409) {
				alert(`${username} is not on Channel Id: ${id}`);
				return;
			}

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.text();
			alert(`${username} was kicked from Channel Id: ${id}`);
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
