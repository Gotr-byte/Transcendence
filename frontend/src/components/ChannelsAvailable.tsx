import { useEffect, useState } from 'react';

type ChannelType = 'PUBLIC' | 'PROTECTED' | 'PRIVATE'; // Add more roles here

interface Channel {
  id: number;
  title: string;
  creatorId: number;
  channelType: ChannelType;
}

interface Channels {
  channelsNo: number;
  channels: Channel[];
}

const ChannelsAvailable: React.FC = () => {
  const [channels, setChannels] = useState<Channels>({ channelsNo: 1, channels: [] });

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('http://localhost:4000/chat/channel/visible', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data: Channels = await response.json();  // Corrected from UserData to UsersData
        setChannels(data);

      } catch (error) {
        console.error('Error fetching users:', error);  // Corrected the message
      }
    };

    fetchChannels();
  }, []);

  return (
    <div>
      {channels.channelsNo > 0 ? (
        <ul>
          {channels.channels.map((channel) => (
            <li key={channel.id}>
              {channel.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No channels found</p>
      )}
    </div>
  );
};

export default ChannelsAvailable;
