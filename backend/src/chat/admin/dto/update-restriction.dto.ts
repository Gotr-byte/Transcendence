import { ChannelUserRestrictionTypes } from '@prisma/client';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateRestrictionDto {
  @IsString()
  @IsOptional()
  restrictionType: ChannelUserRestrictionTypes;

  @IsDate()
  @IsOptional()
  duration: Date;
}
