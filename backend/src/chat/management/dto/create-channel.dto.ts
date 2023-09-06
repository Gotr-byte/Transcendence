import { ChannelTypes } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, NotContains } from 'class-validator';

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
  @NotContains(" ")
  password: string;
}
