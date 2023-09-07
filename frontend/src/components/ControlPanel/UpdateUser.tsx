import React, { useState } from "react";

interface UserPayload {
  username: string;
}

const UpdateUser: React.FC = () => {
  const [username, setName] = useState<string>("");

  const handleUpdate = async () => {
    try {
      const payload: UserPayload = {
        username,
      };

      const response = await fetch(`http://localhost:4000/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      window.location.reload();
    } catch (error) {
      console.error("There was an error updating the user:", error);
    }
  };

  return (
    <div>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setName(e.target.value)}
        />
      <button onClick={handleUpdate}>Update username</button>
    </div>
  );
};

export default UpdateUser;
