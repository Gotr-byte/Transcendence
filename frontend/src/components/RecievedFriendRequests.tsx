import React, { useEffect, useState } from 'react';
import AcceptButton from './AcceptButton';

// The blueprint of your user
interface User {
  id: number;
  username: string;
  isOnline: boolean;
  avatar: string;
}

// The dojo for "Received Friend Requests"
const ReceivedFriendRequests: React.FC = () => {
  const [receivedRequests, setReceivedRequests] = useState<User[]>([]);  // Store received friend requests

  // The ancient technique of API summoning
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/friends/received',{
			credentials: "include",
		  }); 
        if (response.ok) {
          const data = await response.json();
          setReceivedRequests(data.users);  // Update the state with fetched data
        } else {
          throw new Error('Failed to fetch data, young padawan');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchData();  // Invoke the ancient technique
  }, []);

  // Your dojo's banner
  return (
    <div>
      <h1>Received Friend Requests</h1>
      <ul>
        {receivedRequests.map((user) => (
          <li key={user.id}>
            <span>{user.username}</span>
            <span>{user.isOnline ? 'Online' : 'Offline'}</span>
			<img
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              src={user.avatar}
              alt={`${user.username}'s avatar`}
            />
			<AcceptButton username={user.username} /> 
			</li>
        ))}
      </ul>
    </div>
  );
};

export default ReceivedFriendRequests;
