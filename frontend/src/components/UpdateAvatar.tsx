import { useState } from "react";

interface AvatarPayload {
  avatar: string;
}

const UpdateAvatar: React.FC = () => {
  const [avatar, setAvatar] = useState<string>("");

  const handleUpdate = async () => {
    try {
      const payload: AvatarPayload = {
        avatar,
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
        placeholder="Enter avatar URL"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
      />
      <button onClick={handleUpdate}>Update avatar</button>
    </div>
  );
};

export default UpdateAvatar;
