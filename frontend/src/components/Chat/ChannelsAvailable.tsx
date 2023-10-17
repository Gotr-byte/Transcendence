import React, { useEffect, useState } from "react";
import JoinChannelButton from "./JoinChannelButton";
// import { Spacer } from '@chakra-ui/react';

type ChannelType = "PUBLIC" | "PROTECTED" | "PRIVATE";

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

interface ChannelsAvailableProps {
	onChangeRoom: (roomId: number) => void;
}

const ChannelsAvailable: React.FC<ChannelsAvailableProps> = ({
	onChangeRoom,
}) => {
	const [channels, setChannels] = useState<Channels>({
		channelsNo: 0,
		channels: [],
	});

	useEffect(() => {
		const fetchChannels = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/chat/channel/visible`,
					{
						credentials: "include",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch channels");
				}

				const data: Channels = await response.json();
				setChannels(data);
			} catch (error) {
				console.error("Error fetching channels:", error);
			}
		};

		fetchChannels();
	}, []);


	const changeRoom = (id: number) => {
		onChangeRoom(id);
};

	return (
		<div>
			{channels.channelsNo > 0 ? (
				<ul>
					{channels.channels.map((channel) => (
						<li key={channel.id}>
							<button onClick={() => changeRoom(channel.id)}>
								{channel.title}
							</button>
							<JoinChannelButton
								channelId={channel.id}
								channelType={channel.channelType}
							/>
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
