import { useState } from "react";

interface Decree {
	restrictionType: string;
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
				`Restriction: ${restrictionType} lifted from ${username}`
			);
		} catch (error) {
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
