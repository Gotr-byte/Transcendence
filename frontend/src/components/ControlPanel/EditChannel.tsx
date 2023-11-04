import { useState } from "react";

interface Channel {
	id: number; // id is now a number
	title: string;
	channelType: string;
	password?: string;
}

const EditChannel: React.FC = () => {
	// Initialize state
	const [id, setId] = useState<number>(0); // id is now a number
	const [title, setTitle] = useState<string>("");
	const [channelType, setChannelType] = useState<string>("PUBLIC");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
  const validTitlePattern = /^[a-zA-Z0-9_]*$/;
	// Function to handle editing the channel
	const editChannelHandler = async () => {
		// Prepare the channel data
		const channelData: Channel = {
			id,
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
			// Make the API call to edit the channel
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/chat/management/id/${id}/edit`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(channelData),
				}
			);

			if (response.status === 400) {
				alert(
					`What do you think? We dont have that much channels ;)`
				);
				return;
			}

			if (response.status === 400) {
				alert(
					`The naming format is not accepted please deliver a channel name with characters 'A-z', '0-9' or '_' a length of 1 - 15`
				);
				return;
			}

			if (response.status === 401) {
				alert(
					`You are not authorized to change this channel. You have to be admin or owner`
				);
				return;
			}

			if (response.status === 404) {
				alert(`Channel ID: ${id} doesnt exist`);
				return;
			}

			// Error handling
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Log the response
			const data = await response.json();
			console.log("Channel created:", data);
		} catch (error) {
			setError(`There was a problem creating the channel: ${error}`);
			console.error("There was a problem creating the channel:", error);
		}
	};

	const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Check if the value is not empty and is a number within the range 0-99
		if (value === '' || (Number(value) >= 0 && Number(value) <= 99)) {
			setId(Number(value));
		}
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
			if (value === "" || validTitlePattern.test(value)) {
				setTitle(value);
			}
		};


	// JSX
	return (
		<div>
			<label>
				ChatIdToEdit=
				<input
					style={{ width: "20px" }}
					type="number" // Input type is now "number"
					placeholder="Enter chat id"
					value={id}
					onChange={handleIdChange}
				/>
			</label>

			<input
				type="text"
				placeholder="Enter chat title"
				value={title}
				onChange={handleTitleChange}
				maxLength={15}
			/>

			<label>
				Edit Channel Type:
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
					Edit Password:
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						maxLength={15}
					/>
				</label>
			)}

			{error && <div>{error}</div>}

			<button onClick={editChannelHandler}>Submit</button>
		</div>
	);
};

export default EditChannel;
