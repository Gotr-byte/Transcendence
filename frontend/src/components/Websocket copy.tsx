import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from './Context/WebsocketContexts';

type MessagePayload = {
  content: string;
  receiverId: number;
};

type ReceivedMessagePayload= {
  content: string;
  senderId: number;
}

export const Websocket = () => {
  const [sentMessage, setSentMessage] = useState<MessagePayload>({ content: '', receiverId: 3 });
  const [receivedMessages, setReceivedMessages] = useState<ReceivedMessagePayload[]>([]);
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
    });

    socket.on("new-user-message", (newMessage: ReceivedMessagePayload) => {
      setReceivedMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off("new-user-message");
    };
  }, []);

  const onSubmit = () => {
    // Check if the content is empty before sending the message
    if (sentMessage.content.trim() === '') {
      console.log('Message content is empty. Please enter a message.');
      return;
    }
    const sentMessageJSON = sentMessage;
    socket.emit('send-user-message', sentMessageJSON);
    setSentMessage({ ...sentMessage, content: '' });
  };

  return (
    <div>
      <div>
        <h1>Websocket Component</h1>
        <div>
          {receivedMessages.length === 0 ? (
            <div>No messages</div>
          ) : (
            <div>
              {receivedMessages.map((msg) => (
                  <div>
                    <p>{msg.content}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div>
          <input
            type="text"
            value={sentMessage.content}
            onChange={(e) => setSentMessage({ ...sentMessage, content: e.target.value })}
          />
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};
