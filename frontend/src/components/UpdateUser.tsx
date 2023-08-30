import React, { useState } from 'react';

// Define the shape of the payload you want to send to the server
interface UserPayload {
  username: string;
}

const UpdateUser: React.FC = () => {
  // Define state variables for userId and username
  const [userId, setUserId] = useState<string>('');
  const [username, setName] = useState<string>('');

  // This is the function that will be called when you click the "Update" button
  const handleUpdate = async () => {
    try {
      // Prepare your payload. It will look like { "username": "Fooby" }
      const payload: UserPayload = {
        username,
      };
  
      // Send the PATCH request to the server
      const response = await fetch(`http://localhost:4000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // This ensures cookies, HTTP authentication, and client-side SSL certificates are sent in the request
        body: JSON.stringify(payload),  // Converts your payload object to a JSON string
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse and log the response
      const data = await response.json();
      console.log(data);
  
    } catch (error) {
      // Log any errors
      console.error('There was an error updating the user:', error);
    }
  };

  // Render the component
  return (
    <div>
      <h1>Update User</h1>
      
      {/* User ID Input */}
      <div>
        <label>Current username (ID): </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      
      {/* New Username Input */}
      <div>
        <label>Update username: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      {/* Update Button */}
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default UpdateUser;
