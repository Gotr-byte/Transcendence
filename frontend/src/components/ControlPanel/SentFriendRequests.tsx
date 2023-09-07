import React, { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  isOnline: boolean;
  avatar: string;
}

const SentFriendRequests: React.FC = () => {
  const [sentRequests, setSentRequests] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/friends/sent", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setSentRequests(data.users);
        } else {
          throw new Error("Failed to fetch the data, young warrior");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Sent Friend Requests</h1>
      <ul>
        {sentRequests.map((user) => (
          <li key={user.id}>
            <span>{user.username}</span>
            <span>{user.isOnline ? "Online" : "Offline"}</span>
            <img
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              src={user.avatar}
              alt={`${user.username}'s avatar`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentFriendRequests;
