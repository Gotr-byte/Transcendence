import React, { useState } from 'react';

const AddFriend: React.FC = () => {
  // State to keep track of the username input
  const [username, setUsername] = useState<string>('');

  // Function to handle POST request
  const handleAddFriend = async () => {
    try {
      const response = await fetch(`http://localhost:4000/friends/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send cookies if needed
        // body: JSON.stringify(someData), // Uncomment this line if you need to send a payload
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Friend added:', data);
      
    } catch (error) {
      console.error('There was a problem adding the friend:', error);
    }
    window.location.reload();
  };

  return (
    <div>
      {/* Input field to enter the username */}
      <input 
        type="text" 
        placeholder="Enter friend's username" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Button to trigger POST request */}
      <button onClick={handleAddFriend}>Add Friend </button>
    </div>
  );
};

export default AddFriend;
