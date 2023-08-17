import React, { useEffect, useState } from "react";

const App = () => {
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false); // New state for toggling user list visibility

  const fetchUserData = () => {
    fetch("http://localhost:4000/users/all", {
      credentials: "include",
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setShowUsers(true); // Display the users after fetching
      });
  };

  return (
    <div>
      <button onClick={fetchUserData}>Load Users</button> {/* Button to fetch and display users */}
      
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

export default App;