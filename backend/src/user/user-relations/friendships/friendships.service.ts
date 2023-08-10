import { BadRequestException, Injectable } from '@nestjs/common';
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

  async sendFriendRequest(username: string, receivingName: string) {
    const user = await this.userService.getUserByName(username);
    const receivingUser = await this.userService.getUserByName(receivingName);

    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: user.id, receiverId: receivingUser.id },
          { senderId: receivingUser.id, receiverId: user.id },
        ],
      },
    });

    if (existingRequest) {
      throw new BadRequestException(
        `There is already a friendRequest for '${username}' and '${receivingName}'`,
      );
    }
    await this.prisma.friendRequest.create({
      data: {
        senderId: user.id,
        receiverId: receivingUser.id,
      },
    });
  }

  async acceptFriendRequest(acceptingName: string, invitingName: string) {
    const acceptingUser = await this.userService.getUserByName(acceptingName);
    const invitingUser = await this.userService.getUserByName(invitingName);

    const where = {
      isAccepted: false,
      senderId_receiverId: {
        receiverId: acceptingUser.id,
        senderId: invitingUser.id,
      },
    };

    await this.prisma.friendRequest.update({
      where,
      data: {
        isAccepted: true,
      },
    });
  }

  async deleteFriendRequest(username: string, otherUsername: string) {
    const user = await this.userService.getUserByName(username);
    const otherUser = await this.userService.getUserByName(otherUsername);

    const where = {
      OR: [
        { receiverId: user.id, senderId: otherUser.id },
        { receiverId: otherUser.id, senderId: user.id },
      ],
    };

    await this.prisma.friendRequest.deleteMany({
      where,
    });
  }
}
