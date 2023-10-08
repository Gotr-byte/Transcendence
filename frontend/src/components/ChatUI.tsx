import React, { useState, KeyboardEvent } from "react";
import {
  Box,
  Input,
  Grid,
  Flex,
  Text,
  Button,
} from "@chakra-ui/react";
import ChatUsers from "./Chat/ChatUsers";
import ChannelsMember from "./Chat/ChannelsMember";
import ChannelsAvailable from "./Chat/ChannelsAvailable";
import MessageList from "./Chat/MessageList";
import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { DirectMessageSenderList } from "./Chat/DirectMessages";

const ChatUI: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);

  const handleRoomChange = (roomId: number) => {
    setCurrentRoomId(roomId);
  };

  const sendMessage = async () => {
    if (!message || currentRoomId === null) {
      return;
    }

    try {
      const url = `${process.env.API_URL}/messages/channel/${currentRoomId}`;
      const headers: HeadersInit = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };
      const data = JSON.stringify({
        content: message,
      });

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        setMessage("");
        // Add logic to refresh the chat or handle the message in some other way
      } else {
        console.error("Failed to send message!", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Flex direction="column" height="calc(100vh - 400px)" width="100%" overflow="hidden">
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
          {/* <DirectMessageSenderList /> */}
        </Box>
        <Grid templateColumns="3fr 1fr" flex="1" overflowY="hidden">
          <Box
            borderWidth={1}
            borderRadius="0"
            overflowY="scroll"
            height="calc(100vh - 50px)"
          >
            <MessageList roomId={currentRoomId} />
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
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={sendMessage}>Send</Button>
      </Grid>
    </Flex>
  );
};

export default ChatUI;
