import { ChannelMemberRoles } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateRoleDto {
  @IsEnum(ChannelMemberRoles)
  role: ChannelMemberRoles;
}
