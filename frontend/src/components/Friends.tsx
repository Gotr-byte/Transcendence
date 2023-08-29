import React, { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
}

const Friends: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(false);

  const fetchUserData = () => {
    fetch("http://localhost:4000/friends", {
      credentials: "include",
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setShowUsers(true);
      });
  };
  fetchUserData();
  return (
    <div>
      {/* <button onClick={fetchUserData}>Load Users</button> */}
      
      {showUsers && users.length > 0 && (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Friends;
