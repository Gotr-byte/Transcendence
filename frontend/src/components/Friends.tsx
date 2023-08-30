import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  isOnline: boolean;
  avatar: string;
}

interface FriendsList {
  usersNo: number;
  users: User[];
}

const Friends: React.FC = () => {
  const [friendsList, setFriendsList] = useState<FriendsList>({ usersNo: 0, users: [] });

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('http://localhost:4000/friends', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }

        const data: FriendsList = await response.json();
        setFriendsList(data);

      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);  // Empty dependency array ensures this runs only when the component mounts.

  return (
    <div>
      <h1>Friends List</h1>
      {friendsList.usersNo > 0 ? (
        <ul>
          {friendsList.users.map((user) => (
            <li key={user.id}>
              {user.username} is online: {user.isOnline ? 'Yes' : 'No'}
              <img 
  style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
  src={user.avatar} 
  alt={`${user.username}'s avatar`} 
/>

            </li>
          ))}
        </ul>
      ) : (
        <p>No friends found.</p>
      )}
    </div>
  );
};

export default Friends;
