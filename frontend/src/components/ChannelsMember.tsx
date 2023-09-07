import React, { useEffect, useState } from 'react';
import LeaveChannelButton from './LeaveChannelButton';

type ChannelType = 'PUBLIC' | 'PROTECTED' | 'PRIVATE'; 

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

interface ChannelsMemberProps {
  onChangeRoom: (roomId: number) => void;
}

const ChannelsMember: React.FC<ChannelsMemberProps> = ({ onChangeRoom }) => {
  const [channels, setChannels] = useState<Channels>({ channelsNo: 0, channels: [] });

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('http://localhost:4000/chat/channel/memberships', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch channels');
        }

        const data: Channels = await response.json();
        setChannels(data);
      } catch (error) {
        console.error('Error fetching channels:', error);
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
              <button onClick={() => onChangeRoom(channel.id)}>
                {channel.title}
              </button>
              <LeaveChannelButton channelId={channel.id}/>
            </li>
          ))}
        </ul>
      ) : (
        <p>No channels found</p>
      )}
    </div>
  );
};

export default ChannelsMember;
