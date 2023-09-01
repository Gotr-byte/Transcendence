import {
  ChannelMemberRoles,
  ChannelUserRestrictionTypes,
  User,
} from '@prisma/client';
import { UserWithRoleRestriction, extendedChannel } from '../types/types';

export class ShowUserRolesRestrictions {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;
  role: ChannelMemberRoles;
  restriction?: ChannelUserRestrictionTypes;
  restrictionDuration?: Date | null;

  constructor(user: User, channel: extendedChannel) {
    this.id = user.id;
    this.username = user.username;
    this.avatar = user.avatar;
    this.isOnline = user.isOnline;
    this.role = channel.channelUsers[0].role;
    this.restriction = channel.restrictedUsers?.[0]?.restrictionType;
    this.restrictionDuration = channel.restrictedUsers?.[0]?.duration;
  }

  static from(user: User, channel: extendedChannel): ShowUserRolesRestrictions {
    return new ShowUserRolesRestrictions(user, channel);
  }
}

export class ShowUsersRolesRestrictions {
  usersNo: number;
  users: ShowUserRolesRestrictions[];

  constructor(users: UserWithRoleRestriction[]) {
    this.usersNo = users.length;
    this.users = users.map((member) =>
      ShowUserRolesRestrictions.from(member.user, member.channel),
    );
  }

  static from(users: UserWithRoleRestriction[]): ShowUsersRolesRestrictions {
    return new ShowUsersRolesRestrictions(users);
  }
}
