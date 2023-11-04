import React, { useState } from "react";

interface UserPayload {
  username: string;
}

const UpdateUser: React.FC = () => {
  const [username, setName] = useState<string>("");

  const validUsernamePattern = /^[a-zA-Z0-9_]*$/;

  const handleUpdate = async () => {
    try {
      const payload: UserPayload = {
        username,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.status === 400) {
        alert(`The naming format is not accepted please deliver a username with characters 'A-z', '0-9' or '_' and a length of 1 - 15`);
        return;
      }

      if (response.status === 409) {
        alert('That username is already taken. Please try a different one.');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      alert(`Username was succesfully changed to ${payload.username}`)
      window.location.reload();
    } catch (error) {
      console.error("There was an error updating the user:", error);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
    if (value === "" || validUsernamePattern.test(value)) {
      setName(value);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={handleUsernameChange}
        maxLength={15}
      />
      <button onClick={handleUpdate}>Update username</button>
    </div>
  );
};

export default UpdateUser;
