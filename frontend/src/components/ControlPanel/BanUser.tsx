import { useState } from 'react';

// {
//   "restrictionType": "optional-restrictionType BANNED or MUTED",
//   "duration": "optional-duration for the restriction in JS Date format, if empty: indefinite restriction"
// }

interface Decree {
  restrictionType: string;
  duration: string;
}

const BanUser: React.FC = () => {
  const [id, setId] = useState<number>(0);  // id is now a number
  const [username, setUsername] = useState<string>('');
  const [restrictionType, setRestrictionType] = useState<string>('BANNED')
  const [duration, setDuration] = useState<string>('');
  
  const [error, setError] = useState<string | null>(null);


  const decreeData: Decree = {
     restrictionType,
     duration,
    };
  const banHandler = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/chat/admin/id/${id}/${username}/restrict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(decreeData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Channel created:', data);
    } catch (error) {
      setError(`There was a problem enablig restriction ${error}`);
      console.error('There was a problem enabling restriction', error);
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
        Restriction Type:
        <select value={restrictionType} onChange={(e) => setRestrictionType(e.target.value)}>
          <option value="BANNES">BANNED</option>
          <option value="MUTED">MUTED</option>
        </select>
      </label>
      <label>
        Duration:YYYY-MM-DDTHH:MM:SS:
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </label>
      

      <button onClick={banHandler}>EnableRestriction</button>
    </div>
  );
};

export default BanUser;
