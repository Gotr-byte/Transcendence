import { useState, useEffect } from 'react';

export const DirectMessageSenderList = () => {
  const [senders, setSenders] = useState<string[]>([]);

  const openChatWindow = (messages: any[]) => {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <div style="font-family: 'Arial, sans-serif'; padding: 16px;">
          <h2>Chat Window</h2>
          <div id="messages" style="border: 1px solid #ccc; padding: 16px; height: 200px; overflow-y: scroll;">
            ${messages.map((msg) => `<p><strong>${msg.sender}:</strong> ${msg.content}</p>`).join('')}
          </div>
          <textarea id="messageInput" style="width: 100%; height: 50px; margin-top: 16px;"></textarea>
          <button id="sendMessageButton" style="margin-top: 8px;">Send</button>
        </div>
      `);

      const messageInput = newWindow.document.getElementById('messageInput');
      const sendMessageButton = newWindow.document.getElementById('sendMessageButton');
      
      if (sendMessageButton && messageInput) {
        sendMessageButton.addEventListener('click', () => {
          const newMessage = (messageInput as HTMLTextAreaElement).value;
          console.log('New message:', newMessage);
          // Here add your function to send the new message to your server
        });
      }
    }
  };

  const fetchMessages = (sender: string) => {
    fetch(`http://localhost:4000/messages/user/${sender}`, {
      method: 'GET',
      credentials: 'include',
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
        openChatWindow(data.messages);
      })
      .catch((error) => console.error('Error fetching messages from', sender, ':', error));
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
      .catch((error) => console.error('Error fetching senders:', error));
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
