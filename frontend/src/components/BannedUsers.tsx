import { useEffect, useState } from 'react';

type UserRole = 'ADMIN' | 'USER'; // Add more roles here

interface User {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;
  role: UserRole;
}

interface UsersData {
  usersNo: number;
  users: User[];
}

const ChatUsers: React.FC = () => {
  const [chatUsers, setChatUsers] = useState<UsersData>({ usersNo: 0, users: [] });

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const response = await fetch(`http://localhost:4000/chat/admin/id/5/restricted`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data: UsersData = await response.json();  // Corrected from UserData to UsersData
        setChatUsers(data);

      } catch (error) {
        console.error('Error fetching users:', error);  // Corrected the message
      }
    };

    fetchChatUsers();
  }, []);

  return (
    <div>
      <h1>Chat Room Users</h1>
      {chatUsers.usersNo > 0 ? (
        <ul>
          {chatUsers.users.map((user) => (
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
        <p>No users found :</p>
      )}
    </div>
  );
};

export default ChatUsers;
