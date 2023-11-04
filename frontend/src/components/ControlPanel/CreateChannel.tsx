import { useState } from "react";

interface Channel {
	title: String;
	channelType: String;
	password?: String;
}

const CreateChannel: React.FC = () => {
	const [title, setTitle] = useState<string>("");
	const [channelType, setChannelType] = useState<string>("PUBLIC");
	const [password, setPassword] = useState<string>("");

	const createChannel = async () => {
		const channelData: Channel = {
			title,
			channelType,
		};

		if (channelType === "PROTECTED") {
			channelData.password = password;
			if (!password) {
				alert("Password can not be empty");
				return;
			}
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/chat/management/create`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(channelData),
				}
			);

			if (response.status === 400) {
				alert(
					`The naming format is not accepted please deliver a channel name with characters 'A-z', '0-9' or '_' and a length of 1 - 15`
				);
				return;
			}
			if (response.status === 409) {
				alert(
					"That channel name is already taken. Please try a different one."
				);
				return;
			}

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Channel created:", data);
		} catch (error) {
			console.error("There was a problem creating the channel:", error);
		}
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Enter chat room title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			<label>
				Channel Type:
				<select
					value={channelType}
					onChange={(e) => setChannelType(e.target.value)}
				>
					<option value="PUBLIC">Public</option>
					<option value="PRIVATE">Private</option>
					<option value="PROTECTED">Protected</option>
				</select>
			</label>

			{channelType === "PROTECTED" && (
				<label>
					Password:
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
			)}

			<button onClick={createChannel}>Create Channel</button>
		</div>
	);
};

export default CreateChannel;
