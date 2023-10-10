import { useState, useContext, useEffect } from "react";
import { Box, Input, Grid, Flex, Text, Button } from "@chakra-ui/react";
import ChatUsers from "./Chat/ChatUsers";
import ChannelsMember from "./Chat/ChannelsMember";
import ChannelsAvailable from "./Chat/ChannelsAvailable";
import MessageList from "./Chat/MessageList";
import { Tab, TabList, Tabs } from "@chakra-ui/react";

import { WebsocketContext } from "./Context/WebsocketContexts";

type MessagePayload = {
  content: string;
  channelId: number;
};

type ReceivedMessagePayload = {
  content: string;
};

const ChatUI: React.FC = () => {
	const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
    const [sentMessage, setSentMessage] = useState<MessagePayload>({
      content: "",
      channelId: currentRoomId
    });
	const [receivedMessages, setReceivedMessages] = useState<
    ReceivedMessagePayload[]
  >([]);
	const socket = useContext(WebsocketContext);

	const handleRoomChange = (roomId: number) => {
		setCurrentRoomId(roomId);
		setSentMessage({
			...sentMessage,
			channelId: roomId, // Set the channelId to the roomId
		  });
	};
	useEffect(() => {
		socket.on("channel-msg-3", (newMessage: ReceivedMessagePayload) => {
			setReceivedMessages((prev) => [...prev, newMessage]);
		});
		return () => {
		  console.log("Unregistering Events...");
		  socket.off("channel-msg-3");
		};
	  }, [socket]);
	    const onSubmit = () => {
		if (sentMessage.content.trim() === "") {
		  alert("Message content is empty. Please enter a message.");
		  return;
		}
		const sentMessageJSON = sentMessage;
		socket.emit("send-channel-message", sentMessageJSON);
		setSentMessage({ ...sentMessage, content: "" });
		};
	return (
		<Flex
			direction="column"
			height="calc(100vh)"
			width="100%"
			overflow="hidden"
		>
			<Flex flex="1" overflowY="hidden">
				<Box
					borderWidth={1}
					borderRadius="0"
					width="200px"
					overflowY="auto"
					height="calc(100vh - 50px)"
				>
					<Tabs isFitted variant="enclosed">
						<TabList mb="1em">
							<Tab>
								{currentRoomId ? `Room: ${currentRoomId}` : "No Room Selected"}
							</Tab>
						</TabList>
					</Tabs>
					<Text fontSize="xl" p="4">
						Chat Rooms
					</Text>
					<Text fontSize="md" p="4" fontWeight="bold">
						Rooms You've Joined
					</Text>
					<ChannelsMember onChangeRoom={handleRoomChange} />
					<Text fontSize="md" p="4" fontWeight="bold">
						Available Rooms
					</Text>
					<ChannelsAvailable onChangeRoom={handleRoomChange} />
					<Text fontSize="md" p="4" fontWeight="bold">
						Direct Messages
					</Text>
				</Box>
				<Grid templateColumns="3fr 1fr" flex="1" overflowY="hidden">
					<Box
						borderWidth={1}
						borderRadius="0"
						overflowY="scroll"
						height="calc(100vh - 50px)"
					>
					{receivedMessages.map((msg, index) => (
                      <div key={index}>
                      <p>{msg.content}</p>
                      </div>
                    ))}
						{/* <MessageList roomId={currentRoomId} /> */}
					</Box>
					<Box
						borderWidth={1}
						borderRadius="0"
						overflowY="scroll"
						height="calc(100vh - 50px)"
					>
						<ChatUsers currentRoomId={currentRoomId} />
					</Box>
				</Grid>
			</Flex>
			<Grid templateColumns="3fr 1fr" height="50px">
			    <Input
                  value={sentMessage.content}
                  placeholder="Type your message here"
                  onChange={(e) =>
                    setSentMessage({ ...sentMessage, content: e.target.value })
                  }
                />
				<Button onClick={onSubmit}>Send</Button>
			</Grid>
		</Flex>
	);
};

export default ChatUI;
