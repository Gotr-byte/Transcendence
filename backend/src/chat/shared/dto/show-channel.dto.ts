import { Channel } from '@prisma/client';
import { ChannelDto } from './channel.dto';

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