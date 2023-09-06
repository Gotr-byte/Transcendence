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

interface ChatUsersProps {
  currentRoomId: number | null;  // New prop
}

const ChatUsers: React.FC<ChatUsersProps> = ({ currentRoomId }) => { // New prop
  const [chatUsers, setChatUsers] = useState<UsersData>({ usersNo: 0, users: [] });

  useEffect(() => {
    const fetchChatUsers = async () => {
      if (!currentRoomId) {  // New check
        return;
      }

      try {
        console.log(currentRoomId);
        // http://localhost:4000/chat/channel/id/3/users
        // const response = await fetch(`http://localhost:4000/chat/admin/id/${currentRoomId}/users`, {  // Dynamic URL
        const response = await fetch(`http://localhost:4000/chat/channel/id/${currentRoomId}/users`, {  // Dynamic URL
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data: UsersData = await response.json();
        setChatUsers(data);

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchChatUsers();
  }, [currentRoomId]);  // Dependency updated

  return (
    <div>
      <h1>Chat Room Users in Room: {currentRoomId || 'None selected'}</h1>  // Display current room
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
