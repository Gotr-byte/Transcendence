import { ChannelUserRestrictionTypes } from '@prisma/client';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class RestrictionDto {
  @IsString()
  restrictionType: ChannelUserRestrictionTypes;

  @IsDate()
  @IsOptional()
  duration: Date;

  @IsOptional()
  actionType: string;
}
