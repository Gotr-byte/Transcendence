import { ChannelMemberRoles, User } from '@prisma/client';
import { UserWithRole } from '../types';

export class ShowUserRoles {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;
  inGame: boolean;
  role: ChannelMemberRoles;

  constructor(user: User, role: ChannelMemberRoles) {
    this.id = user.id;
    this.username = user.username;
    this.avatar = user.avatar;
    this.isOnline = user.isOnline;
    this.inGame = user.inGame;
    this.role = role;
  }

  static from(user: User, role: ChannelMemberRoles): ShowUserRoles {
    return new ShowUserRoles(user, role);
  }
}

export class ShowUsersRoles {
  usersNo: number;
  users: ShowUserRoles[];

  constructor(users: UserWithRole[]) {
    this.usersNo = users.length;
    const mappedUsers = users.map((member) =>
      ShowUserRoles.from(member.user, member.role),
    );

    this.users = mappedUsers.sort((a, b) => {
      return Number(b.isOnline) - Number(a.isOnline);
    });
  }

  static from(users: UserWithRole[]): ShowUsersRoles {
    return new ShowUsersRoles(users);
  }
}
