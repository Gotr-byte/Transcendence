import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

const Friends: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:4000/friends', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run this effect only once when the component mounts.

  return (
    <div>
      {users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username} is online: {user.isOnline ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;
