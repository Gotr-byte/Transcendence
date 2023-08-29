import { ChannelMemberRoles, ChannelTypes, User } from '@prisma/client';

export type UserWithRole = {
  user: User;
  role: ChannelMemberRoles;
};
