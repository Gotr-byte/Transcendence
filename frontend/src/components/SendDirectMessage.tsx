import { useState } from 'react';
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

const SendDirectMessage: React.FC<SendDirectMessageProps> = ({ username }) => {
  const [content, setContent] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sendDirectMessage = async () => {
    try {
      const message: MessageBody = {
        content,
      };
      const response = await fetch(`${process.env.API_URL}/messages/user/${username}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      }); 

      if (!response.ok) {
        throw new Error('Failed to send direct message');
      }
      onClose();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <>
      <Button onClick={onOpen}>DM</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send a message to {username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={content}
              placeholder="Type your message here"
              onChange={(e) => setContent(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={sendDirectMessage}>
              Send
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendDirectMessage;
