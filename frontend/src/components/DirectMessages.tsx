import { useState, useEffect } from 'react';

export const DirectMessageSenderList = () => {
  const [senders, setSenders] = useState<string[]>([]);

  const fetchMessages = (sender: string) => {
    fetch(`http://localhost:4000/messages/user/${sender}`, {
      method: 'GET',
	  credentials:"include",
      headers: {
        'Accept': '*/*',
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Messages from', sender, ':', data.messages);
    })
    .catch((error) => console.error("Error fetching messages from", sender, ":", error));
  };
  
  useEffect(() => {
    fetch(`http://localhost:4000/messages/chats`, {
      credentials: 'include',
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then((data: string[]) => {
      setSenders(data);
    })
    .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  return (
    <div>
      <h2>Users who sent direct messages</h2>
      {senders.map((sender, index) => (
        <div key={index} onClick={() => fetchMessages(sender)}>
          {sender}
        </div>
      ))}
    </div>
  );
};
