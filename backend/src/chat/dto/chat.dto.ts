import { Channel, ChannelTypes } from '@prisma/client';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class ShowChannelDto {
  channel: ChannelDto;
  usersNo: number;

  constructor(channel: Channel, usersNo: number) {
    this.channel = ChannelDto.from(channel);
    this.usersNo = usersNo;
  }

  static from(channel: Channel, usersNo: number): ShowChannelDto {
    return new ShowChannelDto(channel, usersNo);
  }
}

export class ShowChannelsDto {
  channels: ChannelDto[];
  channelsNo: number;

  constructor(channels: Channel[]) {
    this.channelsNo = channels.length;
    this.channels = channels.map((channel) => ChannelDto.from(channel));
  }

  static from(channels: Channel[]): ShowChannelsDto {
    return new ShowChannelsDto(channels);
  }
}

export class AddUsersDto {
  @IsArray()
  @IsNotEmpty()
  users: number[];
}

export class JoinChannelDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;
}

