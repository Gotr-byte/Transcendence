import { useState } from 'react';
// 
interface Role {
  role: string;
}

const DesignateAdmin: React.FC = () => {
  // Initialize state
  const [id, setId] = useState<number>(0);  // id is now a number
  const [username, setUsername] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Function to handle editing the channel
  const designateHandler = async () => {
    const roleData: Role = {
      role,
    };
    // Prepare the channel data
    try {
      // Make the API call to edit the channel
      const response = await fetch(`/chat/admin/id/${id}/${username}/update-role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify( roleData ),  // Updated this line to send role as a property in a JSON object
      });

      // Error handling
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Log the response
      const data = await response.json();
      console.log('Designated admin:', data);

    } catch (error) {
      setError(`There was a problem designating admin: ${error}`);
      console.error('There was a problem designating admin:', error);
    }
  };

  // JSX
  return (
    <div>
      <label>
        ChatId=
        <input 
        type="number"  // Input type is now "number"
        placeholder="Enter chat id" 
        value={id}
        onChange={(e) => setId(Number(e.target.value))}  // Convert string to number
      />
      </label>
      
      <input 
        type="text" 
        placeholder="Enter username" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
        <label>
        Channel Type:
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ADMIN">ADMIN</option>
          <option value="MEMBER">MEMBER</option>
        </select>
      </label>
      <button onClick={designateHandler}>DesignateRole</button>
      {error && <div style={{color: 'red'}}>{error}</div>} {/* Display error message when there is an error */}
    </div>
  );
};

export default DesignateAdmin;
