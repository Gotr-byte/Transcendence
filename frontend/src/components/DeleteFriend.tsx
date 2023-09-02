import React, { useState } from 'react';

const DeleteFriend: React.FC = () => {
  const [friendName, setFriendName] = useState('');

  const handleDelete = async () => {
    if (!friendName) {
      console.error("Friend name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/friends/${friendName}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
	  window.location.reload();
      console.log(`Friend ${friendName} successfully deleted`);
      setFriendName('');
    } catch (error) {
      console.error(`There was a problem deleting the friend ${friendName}`, error);
    }
  };

  return (
    <div>
      <input 
        type="text"
        placeholder="Enter friend's username"
        value={friendName}
        onChange={e => setFriendName(e.target.value)}
      />
      <button onClick={handleDelete}>Delete Friend</button>
    </div>
  );
};

export default DeleteFriend;
