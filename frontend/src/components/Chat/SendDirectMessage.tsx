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

import { useContext, useEffect, useState} from "react";
import { WebsocketContext } from "../Context/WebsocketContexts";

type MessagePayload = {
  content: string;
  receiverId: number;
};

type ReceivedMessagePayload = {
  content: string;
  sender: string;
};

interface SendDirectMessageProps {
  username: string;
  id: number;
}

export const SendDirectMessage: React.FC<SendDirectMessageProps> = ({
  username,
  id,
}) => {
  const [sentMessage, setSentMessage] = useState<MessagePayload>({
    content: "",
    receiverId: id,
  });
  const [receivedMessages, setReceivedMessages] = useState<
    ReceivedMessagePayload[]
  >([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const socket = useContext(WebsocketContext);
  useEffect(() => {
    if (id === null) return;
    const eventName = `user-msg-${id}`
    socket.on(eventName, (newMessage: ReceivedMessagePayload) => {
				const taggedMessage = {
						...newMessage,
						content: newMessage.sender + ": " + newMessage.content,
        };
      setReceivedMessages((prev) => [...prev, taggedMessage]);
    });
    return () => {
      console.log("Unregistering Events...");
      socket.off(eventName);
    };
  }, [socket, id]);
  const onSubmit = () => {
    if (sentMessage.content.trim() === "") {
      alert("Message content is empty. Please enter a message.");
      return;
    }
    const sentMessageJSON = sentMessage;
    socket.emit("send-user-message", sentMessageJSON);
    setSentMessage({ ...sentMessage, content: "" });
  };

  return (
    <>
      <Button variant="solid" size="xs" onClick={onOpen}>
        DM
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send a message to {username}</ModalHeader>
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
              {receivedMessages.map((msg, index) => (
                <div key={index}>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
            <Input
              value={sentMessage.content}
              placeholder="Type your message here"
              onChange={(e) =>
                setSentMessage({ ...sentMessage, content: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSubmit}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendDirectMessage;
