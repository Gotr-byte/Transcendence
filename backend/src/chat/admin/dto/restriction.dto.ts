import { ChannelUserRestrictionTypes } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

export class RestrictionDto {
  @IsEnum(ChannelUserRestrictionTypes)
  restrictionType: ChannelUserRestrictionTypes;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  duration: Date;

  @IsOptional()
  actionType: string;
}
