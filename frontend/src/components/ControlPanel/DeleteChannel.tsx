import { useState } from "react";

const DeleteChannel: React.FC = () => {
	const [id, setId] = useState<number>(0);

	const handleDelete = async () => {
		if (!id) {
			console.error("Id must be a positive integer greater than zero");
			return;
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/chat/management/id/${id}`,
				{
					method: "DELETE",
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
					`You are not authorized to delete this channel. You have to be channel owner`
				);
				return;
			}

			if (response.status === 404) {
				alert(
					`Channel ID: ${id} doesnt exist`
				);
				return;
			}

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			alert(`Channel Id: ${id} successfully deleted`);
			window.location.reload();
			setId(0);
		} catch (error) {
			console.error(`There was a problem deleting the channel ${id}`, error);
		}
	};

	const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === '' || (Number(value) >= 0 && Number(value) <= 99)) {
			setId(Number(value));
		}
	};

	return (
		<div>
			<label>ChannelIdToDelete=</label>
			<input
				style={{ width: "20px" }}
				type="number"
				value={id}
				onChange={handleIdChange}
			/>
			<button onClick={handleDelete}>Delete Channel</button>
		</div>
	);
};

export default DeleteChannel;
