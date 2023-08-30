import { ChannelTypes } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateChannelDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  channelType: ChannelTypes;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  password: string;
}
