import { ChannelTypes } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
	@IsNotEmpty()
	@IsString()
	title: string;
  
	@IsNotEmpty()
	@IsString()
	channelType: ChannelTypes;
  
	@IsNotEmpty()
	@IsString()
	@IsOptional()
	password: string;
  }
