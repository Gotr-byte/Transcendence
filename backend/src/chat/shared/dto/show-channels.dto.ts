import { Channel } from '@prisma/client';
import { ChannelDto } from './channel.dto';

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