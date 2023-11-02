import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useRef } from "react";

const FileUpload: React.FC = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = async () => {
		if (fileInputRef.current?.files?.length) {
			const file = fileInputRef.current.files[0];
			const formData = new FormData();
			formData.append("image", file, file.name);

			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/profile/upload-avatar`,
					{
						method: "PATCH",
						credentials: "include",
						headers: {
							accept: "*/*",
						},
						body: formData,
					}
				);
				const data = await response.json();
				console.log("File uploaded successfully", data);
			} catch (error) {
				console.error("File upload error", error);
			}
			window.location.reload();
		}
	};

	return (
		<FormControl display="flex" alignItems="center" gridGap="2">
			<Input
				type="file"
				ref={fileInputRef}
				size="sm"
				style={{ maxWidth: "400px", flexGrow: 1 }}
			/>
			<button onClick={handleFileUpload}>Upload Avatar</button>
		</FormControl>
	);
};

export default FileUpload;
