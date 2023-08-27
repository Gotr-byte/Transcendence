import { Channel, ChannelTypes } from '@prisma/client';

export class ChannelDto {
  id: number;
  title: string;
  creatorId: number;
  channelType: ChannelTypes;

  constructor(channel: Channel) {
    this.id = channel.id;
    this.title = channel.title;
    this.creatorId = channel.creatorId;
    this.channelType = channel.channelType;
  }

  static from(channel: Channel): ChannelDto {
    return new ChannelDto(channel);
  }
}
