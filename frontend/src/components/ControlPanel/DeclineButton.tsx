import { Button } from '@chakra-ui/react';
import React from 'react';

interface DeclineButtonProps {
  username: string;
}

const DeclineButton: React.FC<DeclineButtonProps> = ({ username }) => {
  const declineRequest = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/friends/${username}`, {
        method: 'DELETE',
        credentials: "include",
    }); 

      if (response.ok) {
        alert('Friend request declined.');
      } else {
        throw new Error('Failed to decline a friend request.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    window.location.reload();
  };

  return (
    <Button onClick={declineRequest} size='xs'>Decline</Button>
  );
};

export default DeclineButton;
