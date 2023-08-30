import {
  ChannelUserRestriction,
  ChannelUserRestrictionTypes,
  User,
} from '@prisma/client';
import { UserWithRestriction } from '../types';

export class ShowUserRestrictions {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;
  restrictionType: ChannelUserRestrictionTypes;
  restrictionDuration?: Date | null;

  constructor(user: User, restriction: ChannelUserRestriction) {
    this.id = user.id;
    this.username = user.username;
    this.avatar = user.avatar;
    this.isOnline = user.isOnline;
    this.restrictionType = restriction.restrictionType;
    this.restrictionDuration = restriction?.duration;
  }

  static from(
    user: User,
    restriction: ChannelUserRestriction,
  ): ShowUserRestrictions {
    return new ShowUserRestrictions(user, restriction);
  }
}

export class ShowUsersRestrictions {
  bannedNo: number;
  mutedNo: number;
  users: ShowUserRestrictions[];

  constructor(users: UserWithRestriction[]) {
    this.users = users.map((user) => {
      user.restriction.restrictionType === ChannelUserRestrictionTypes.BANNED
        ? this.bannedNo++
        : this.mutedNo++;
      return ShowUserRestrictions.from(user.user, user.restriction);
    });
  }

  static from(users: UserWithRestriction[]): ShowUsersRestrictions {
    return new ShowUsersRestrictions(users);
  }
}
