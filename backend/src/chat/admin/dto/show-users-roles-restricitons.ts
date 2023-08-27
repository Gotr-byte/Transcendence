import {
  Channel,
  ChannelMemberRoles,
  ChannelUserRestrictionTypes,
  User,
} from '@prisma/client';
import { UserWithRolesRestrictions, extendedChannel } from '../types/types';

export class ShowUserRolesRestrictions {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;
  role: ChannelMemberRoles;
  restriction?: ChannelUserRestrictionTypes;

  constructor(user: User, channel: extendedChannel) {
    this.id = user.id;
    this.username = user.username;
    this.avatar = user.avatar;
    this.isOnline = user.isOnline;
    this.role = channel.channelUsers[0].role;
    this.restriction = channel.restrictedUsers?.[0]?.restrictionType;
  }

  static from(user: User, channel: extendedChannel): ShowUserRolesRestrictions {
    return new ShowUserRolesRestrictions(user, channel);
  }
}

export class ShowUsersRolesRestrictions {
  usersNo: number;
  users: ShowUserRolesRestrictions[];

  constructor(users: UserWithRolesRestrictions[]) {
    this.usersNo = users.length;
    this.users = users.map((member) =>
      ShowUserRolesRestrictions.from(member.user, member.channel!),
    );
  }

  static from(users: UserWithRolesRestrictions[]): ShowUsersRolesRestrictions {
    return new ShowUsersRolesRestrictions(users);
  }
}
