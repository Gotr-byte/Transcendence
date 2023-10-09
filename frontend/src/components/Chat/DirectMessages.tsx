import { useState, useEffect } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";

interface Message {
	sender: string;
	content: string;
}

export const DirectMessageSenderList = () => {
	const [senders, setSenders] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [messages, setMessages] = useState<Message[]>([]);

	const onClose = () => setIsOpen(false);

	const fetchMessages = (sender: string) => {
		fetch(`${import.meta.env.VITE_API_URL}/messages/user/${sender}`, {
			method: "GET",
			credentials: "include",
			headers: {
				Accept: "*/*",
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						"Network response was not ok: " + response.statusText
					);
				}
				return response.json();
			})
			.then((data: { messages: Message[] }) => {
				console.log("Messages from", sender, ":", data.messages);
				setMessages(data.messages);
				setIsOpen(true);
			})
			.catch((error) =>
				console.error("Error fetching messages from", sender, ":", error)
			);
	};

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/messages/chats`, {
			credentials: "include",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						"Network response was not ok: " + response.statusText
					);
				}
				return response.json();
			})
			.then((data: string[]) => {
				setSenders(data);
			})
			.catch((error) => console.error("Error fetching senders:", error));
	}, []);

	return (
		<div>
			<h2>Users who sent direct messages</h2>
			{senders.map((sender, index) => (
				<div key={index} onClick={() => fetchMessages(sender)}>
					{sender}
				</div>
			))}

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Chat Window</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<div
							style={{
								border: "1px solid #ccc",
								padding: "16px",
								height: "200px",
								overflowY: "scroll",
							}}
						>
							{messages.map((msg, index) => (
								<p key={index}>
									<strong>{msg.sender}:</strong> {msg.content}
								</p>
							))}
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	);
};
