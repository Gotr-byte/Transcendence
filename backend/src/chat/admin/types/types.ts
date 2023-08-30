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

export type UserWithRoleRestriction = {
  user: User;
  channel: extendedChannel;
};

export type UserWithRestriction = {
  user: User;
  restriction: ChannelUserRestriction;
};
