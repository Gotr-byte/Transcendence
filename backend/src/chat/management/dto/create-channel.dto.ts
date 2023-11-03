import { ChannelTypes } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, NotContains } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(ChannelTypes)
  channelType: ChannelTypes;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @NotContains(' ')
  password: string;
}
