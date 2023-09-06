import React from 'react';

interface AcceptButtonProps {
  username: string; // The username of the user who sent the friend request
}

const AddFriendButton: React.FC<AcceptButtonProps> = ({ username }) => {
  const acceptRequest = async () => {
    try {
      const response = await fetch(`http://localhost:4000/friends/${username}`, {
        method: 'POST',
        credentials: "include",
    }); 

      if (response.ok) {
        alert('Friend request accepted.');
      } else {
        throw new Error('Failed to accept friend request.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    window.location.reload();
  };

  return (
    <button onClick={acceptRequest}>
      +
    </button>
  );
};

export default AddFriendButton;
