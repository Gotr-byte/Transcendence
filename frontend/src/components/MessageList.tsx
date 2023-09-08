import { useState, useEffect } from 'react';
import { List, ListItem, Text } from '@chakra-ui/react';

interface Message {
  sender: string;
  content: string;
  createdAt: string;
}

interface MessageListProps {
  roomId: number | null;
}

const MessageList: React.FC<MessageListProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (roomId === null) {
        return;
      }

      try {
        const url = `http://localhost:4000/messages/channel/${roomId}`;
        const response = await fetch(url, {
          method: 'GET',
		  credentials: "include",
          headers: {
            'Accept': '*/*',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchMessages();
  }, [roomId]);

  return (
    <List spacing={3}>
      {messages.map((message, index) => (
        <ListItem key={index}>
          <Text fontWeight="bold">{message.sender}</Text>
          <Text>{message.content}</Text>
        </ListItem>
      ))}
    </List>
  );
};

export default MessageList;
