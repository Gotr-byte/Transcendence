import React from 'react';
import { Button } from '@chakra-ui/react';

interface JoinChannelButtonProps {
  channelId: number;
}

const JoinChannelButton: React.FC<JoinChannelButtonProps> = ({ channelId }) => {

  const joinChannel = async () => {
    try {
      const password = 'mandatory for PROTECTED channel'; // Replace with the actual password
      const url = `http://localhost:4000/chat/channel/id/${channelId}/join`;
      const headers: HeadersInit = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      };
      const data = JSON.stringify({
        password,
      });

      const response = await fetch(url, {
        method: 'POST',
		credentials: "include",
        headers,
        body: data,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Successfully joined the channel!', responseData);
      } else {
        console.error('Failed to join the channel!', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Button colorScheme="teal" onClick={joinChannel}>
      +
    </Button>
  );
};

export default JoinChannelButton;
