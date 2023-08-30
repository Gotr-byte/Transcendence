import {
  Channel,
  ChannelMember,
  ChannelUserRestriction,
  User,
} from '@prisma/client';

export type extendedChannel = Channel & {
  channelUsers: ChannelMember[];
  restrictedUsers?: ChannelUserRestriction[];
};

export type UserWithRolesRestrictions = {
  user: User;
  channel: extendedChannel;
};
