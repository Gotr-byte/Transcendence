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
	const validTitlePattern = /^[a-zA-Z0-9_]*$/;

	const createChannel = async () => {
		const channelData: Channel = {
			title,
			channelType,
		};

		if (channelType === "PROTECTED") {
			channelData.password = password;
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

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Channel created:", data);
		} catch (error) {
			console.error("There was a problem creating the channel:", error);
		}

		window.location.reload();
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
			if (value === "" || validTitlePattern.test(value)) {
				setTitle(value);
			}
		};
	

	return (
		<div>
			<input
				type="text"
				placeholder="Enter chat room title"
				value={title}
				onChange={handleTitleChange}
				maxLength={15}
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
						maxLength={15}
					/>
				</label>
			)}

			<button onClick={createChannel}>Create Channel</button>
		</div>
	);
};

export default CreateChannel;
