import React from 'react';
import { Button } from '@chakra-ui/react';

interface JoinChannelButtonProps {
  channelId: number;
  channelType: string; // new prop to determine if the channel is protected
}

const JoinChannelButton: React.FC<JoinChannelButtonProps> = ({ channelId, channelType }) => {

  const joinChannel = async () => {
    try {
      let password: string | null = null;
      if (channelType === 'PROTECTED') {
        password = prompt('This channel is protected. Please enter the password:');
        if (password === null) {
          // User cancelled the prompt
          return;
        }
      }

      const url = `${process.env.API_URL}/chat/channel/id/${channelId}/join`;
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
