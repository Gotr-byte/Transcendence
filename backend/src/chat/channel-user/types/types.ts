import { ChannelMemberRoles, User } from '@prisma/client';

export type UserWithRole = {
  user: User;
  role: ChannelMemberRoles;
};
