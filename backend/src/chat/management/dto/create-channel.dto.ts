import { ChannelTypes } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, NotContains } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 15)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Channel title can only contain letters, numbers, and underscores',
  })
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
