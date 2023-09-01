import { ChannelUserRestrictionTypes } from '@prisma/client';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateRestrictionDto {
  @IsString()
  restrictionType: ChannelUserRestrictionTypes;

  @IsDate()
  @IsOptional()
  duration: Date;
}
