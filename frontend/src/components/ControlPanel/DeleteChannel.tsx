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
					`What you you think? We dont have that much channels ;)`
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
			window.location.reload();
			console.log(`Channel ${id} successfully deleted`);
			setId(0);
		} catch (error) {
			console.error(`There was a problem deleting the friend ${id}`, error);
		}
	};

	return (
		<div>
			<label>ChatIdToDelete=</label>
			<input
				style={{ width: "20px" }}
				type="number"
				value={id}
				onChange={(e) => setId(Number(e.target.value))}
			/>
			<button onClick={handleDelete}>Delete Channel</button>
		</div>
	);
};

export default DeleteChannel;
