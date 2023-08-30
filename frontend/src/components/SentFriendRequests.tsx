import React, { useEffect, useState } from "react";

// Define the shape of your user
interface User {
  id: number;
  username: string;
  isOnline: boolean;
  avatar: string;
}

// Main component, the dojo where the magic happens
const SentFriendRequests: React.FC = () => {
  const [sentRequests, setSentRequests] = useState<User[]>([]); // Store the list of friends

  // Summoning technique for API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/friends/sent", {
          credentials: "include",
        }); // Summon data from endpoint
        if (response.ok) {
          const data = await response.json();
          setSentRequests(data.users); // Update the state with fetched users
        } else {
          throw new Error("Failed to fetch the data, young warrior");
        }
      } catch (error) {
        console.error("An error occurred:", error); // Log any summoning errors
      }
    };

    fetchData(); // Invoke the summoning
  }, []); // Empty array means this technique is used once when the component mounts

  // The visual part of your dojo, what the world will see
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
