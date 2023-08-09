import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

type FriendRequestWhereInput = {
  isAccepted: boolean;
  senderId?: number;
  receiverId?: number;
};

@Injectable()
export class FriendshipsService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  private async getUsersFromFriendRequests(
    user: User,
    where: FriendRequestWhereInput,
  ) {
    const friendRequests = await this.prisma.friendRequest.findMany({
      where,
    });

    const userIds = friendRequests.map((request) =>
      request.senderId === user.id ? request.receiverId : request.senderId,
    );

    const usersList = await this.userService.getUsersListFromIds(userIds);
    return usersList;
  }

  async getFriends(name: string) {
    const user = await this.userService.findByUsername(name);
    const where = {
      isAccepted: true,
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    };

    const friendsList = await this.getUsersFromFriendRequests(user, where);
    return friendsList;
  }

  async getSentFriendRequests(name: string) {
    const user = await this.userService.findByUsername(name);
    const where = {
      isAccepted: false,
      receiverId: user.id,
    };

    const pendingSentUserList = await this.getUsersFromFriendRequests(
      user,
      where,
    );
    return pendingSentUserList;
  }

  async getReceivedFriendRequests(name: string) {
    const user = await this.userService.findByUsername(name);
    const where = {
      isAccepted: false,
      senderId: user.id,
    };

    const pendingReceivedUserList = await this.getUsersFromFriendRequests(
      user,
      where,
    );
    return pendingReceivedUserList;
  }
}
