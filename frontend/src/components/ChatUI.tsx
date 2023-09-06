import React, { useState } from "react";
import { Box, Input, Grid, List, ListItem, Flex, Text } from "@chakra-ui/react";
import ChatUsers from "./ChatUsers";
import ChannelsMember from "./ChannelsMember";
import ChannelsAvailable from "./ChannelsAvailable";

const ChatUI: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null); // New state

  const handleRoomChange = (roomId: number) => {
    setCurrentRoomId(roomId);
  };

  return (
    <Flex direction="column" height="100vh" width="100%" overflow="hidden">
      <Flex flex="1" overflowY="hidden">
        <Box
          borderWidth={1}
          borderRadius="0"
          width="200px"
          overflowY="auto"
          height="calc(100vh - 50px)"
        >
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
        </Box>
        <Grid templateColumns="3fr 1fr" flex="1" overflowY="hidden">
          <Box
            borderWidth={1}
            borderRadius="0"
            overflowY="scroll"
            height="calc(100vh - 50px)"
          >
            <List spacing={3}>
              <ListItem>Message 1</ListItem>
              <ListItem>Message 2</ListItem>
            </List>
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
        />
        <Box as="button">
          Send
        </Box>
      </Grid>
    </Flex>
  );
};

export default ChatUI;
