import React from 'react';
import { Button } from '@chakra-ui/react';

interface LeaveChannelButtonProps {
  channelId: number;
}

const LeaveChannelButton: React.FC<LeaveChannelButtonProps> = ({ channelId }) => {

  const leaveChannel = async () => {
    try {
      const url = `${process.env.API_URL}/chat/channel/id/${channelId}/leave`;
      const headers: HeadersInit = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, {
        method: 'DELETE',
		credentials: "include",
        headers
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Successfully left the channel!', responseData);
      } else {
        console.error('Failed to leave the channel!', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Button size='xs' colorScheme="teal" onClick={leaveChannel}>
      -
    </Button>
  );
};

export default LeaveChannelButton;
