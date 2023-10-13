import { ChannelUserRestrictionTypes } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class RestrictionDto {
  @IsString()
  restrictionType: ChannelUserRestrictionTypes;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  duration: Date;

  @IsOptional()
  actionType: string;
}
