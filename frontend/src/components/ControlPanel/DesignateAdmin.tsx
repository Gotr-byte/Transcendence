import React, { useState } from 'react';

interface Role {
  role: string;
}

const DesignateAdmin: React.FC = () => {
  const [id, setId] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [role, setRole] = useState<string>('ADMIN');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // New state variable for success message

  const designateHandler = async () => {
    if (id <= 0 || username === '') {
      setError('Please provide valid ID and username.');
      return;
    }

    const roleData: Role = { role };
    
    try {
      const response = await fetch(`/chat/admin/id/${id}/${username}/update-role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Designated admin:', data);
      setSuccess('Admin designated successfully.'); // Setting success message on successful API response
    } catch (error) {
      setError(`There was a problem designating admin: ${error}`);
      console.error('There was a problem designating admin:', error);
    }
  };

  return (
    <div>
      <label>
        ChatId=
        <input 
        type="number" 
        placeholder="Enter chat id" 
        value={id}
        onChange={(e) => setId(Number(e.target.value))}
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
      {error && <div style={{color: 'red'}}>{error}</div>}
      {success && <div style={{color: 'green'}}>{success}</div>} {/* Display success message when operation is successful */}
    </div>
  );
};

export default DesignateAdmin;
