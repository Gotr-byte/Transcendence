import React, { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
}

const AuthFetch: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(false);

  const fetchUserData = () => {
    fetch("http://localhost:4000/users", {
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

  return (
    <div>
      <button onClick={fetchUserData}>Load Users</button>
      
      {showUsers && users.length > 0 && (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
      <button onClick={() => window.location.href = "http://localhost:4000/auth/42/login"}>
        Authenticate
      </button>
    </div>
  );
}

export default AuthFetch;
