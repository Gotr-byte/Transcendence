import { ChannelMemberRoles } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  role: ChannelMemberRoles;
}
