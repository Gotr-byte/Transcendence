import React, { useState } from 'react';

const DeleteFriend: React.FC = () => {
  const [friendName, setFriendName] = useState(''); // State to hold the name of the friend to delete

  const handleDelete = async () => {
    if (!friendName) {
      console.error("Friend name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/friends/${friendName}`, { // Note the dynamic URL
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
	  window.location.reload();
      console.log(`Friend ${friendName} successfully deleted`);
      setFriendName(''); // Reset the input field
    } catch (error) {
      console.error(`There was a problem deleting the friend ${friendName}`, error);
    }
  };

  return (
    <div>
      {/* Input field for friend's name */}
      <input 
        type="text"
        placeholder="Friend's name"
        value={friendName}
        onChange={e => setFriendName(e.target.value)}
      />

      {/* Delete button */}
      <button onClick={handleDelete}>Delete Friend</button>
    </div>
  );
};

export default DeleteFriend;
