import { CreateChannelDto } from './create-channel.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
