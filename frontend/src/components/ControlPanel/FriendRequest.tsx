import React, { useEffect, useState } from 'react';

interface FriendRequest {
  to: string;
  from: string;
  status: string;
}

const SentFriendRequests: React.FC = () => {
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const response = await fetch('http://localhost:4000/friends/sent', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSentRequests(data);

      } catch (error) {
        console.error('There was a problem fetching sent friend requests:', error);
      }
    };

    fetchSentRequests();
  }, []);

  return (
    <div>
      <h1>Sent Friend Requests</h1>
      <ul>
        {sentRequests.map((request, index) => (
          <li key={index}>
            To: {request.to}, Status: {request.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentFriendRequests;
