import React, { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from './Context/WebsocketContexts';

type MessagePayload = {
  content: string;
  receiverId: number;
};

export const Websocket = () => {
  const [sentMessage, setSentMessage] = useState<MessagePayload>({ content: '', receiverId: 2 });
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
    });
    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
    };
  }, [socket]);

  const onSubmit = () => {
    // Check if the content is empty before sending the message
    if (sentMessage.content.trim() === '') {
      console.log('Message content is empty. Please enter a message.');
      return;
    }

    // Convert the sentMessage object to a JSON string
    const sentMessageJSON = sentMessage;

    // Log the message content
    console.log(sentMessage);

    // Send the JSON string to the server
    socket.emit('send-user-message', sentMessageJSON);

    // Clear the input field
    setSentMessage({ ...sentMessage, content: '' });
  };

  return (
    <div>
      <div>
        <h1>Websocket Component</h1>
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
