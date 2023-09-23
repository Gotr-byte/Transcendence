import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";

interface SendDirectMessageProps {
  username: string;
}

interface MessageBody {
  content: string;
}

interface Message {
  sender: string;
  content: string;
}

export const SendDirectMessage: React.FC<SendDirectMessageProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchMessages = () => {
    fetch(`${process.env.API_URL}/messages/user/${username}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': '*/*',
      },
    })
      .then(response => response.json())
      .then(data => setMessages(data.messages))
      .catch(error => console.error('Error fetching messages:', error));
  };

  const sendDirectMessage = async () => {
    try {
      const message: MessageBody = { content };
      const response = await fetch(`${process.env.API_URL}/messages/user/${username}`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      
      if (response.ok) {
        fetchMessages();
        setContent('');
      } else {
        throw new Error('Failed to send direct message');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  return (
    <>
      <Button variant="solid" size='xs' onClick={onOpen}>DM</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send a message to {username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={{ border: '1px solid #ccc', padding: '16px', height: '200px', overflowY: 'scroll' }}>
              {messages.map((msg, index) => (
                <p key={index}><strong>{msg.sender}:</strong> {msg.content}</p>
              ))}
            </div>
            <Input value={content} placeholder="Type your message here" onChange={e => setContent(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={sendDirectMessage}>
              Send
            </Button>
            <Button variant="solid" size='xs' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendDirectMessage;
