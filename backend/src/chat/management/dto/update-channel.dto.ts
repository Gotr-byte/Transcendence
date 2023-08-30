import { ChannelTypes } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateChannelDto } from './create-channel.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
