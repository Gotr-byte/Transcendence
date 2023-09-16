import { useState } from "react";

const DeleteChannel: React.FC = () => {
  const [id, setId] = useState<number>(0);

  const handleDelete = async () => {
    if (!id) {
      console.error("Id must be a positive integer greater than zero");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/chat/management/id/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      window.location.reload();
      console.log(`Channel ${id} successfully deleted`);
      setId(0);
    } catch (error) {
      console.error(`There was a problem deleting the friend ${id}`, error);
    }
  };

  return (
    <div>
      <label>ChatIdToDelete=</label>
      <input
        type="number"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete Channel</button>
    </div>
  );
};

export default DeleteChannel;
