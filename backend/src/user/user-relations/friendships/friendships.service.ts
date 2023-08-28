import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { FriendRequestWhereInput } from 'src/user/types';
import { ShowUsersDto } from 'src/user/dto';

@Injectable()
export class FriendshipsService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // Get a list of users based on the provided where clause
  private async getUsersFromFriendRequests(
    user: User,
    where: FriendRequestWhereInput,
  ): Promise<ShowUsersDto> {
    // Fetch friend requests based on the provided criteria
    const friendRequests = await this.prisma.friendRequest.findMany({
      where,
    });

    // Extract user IDs from friend requests
    const userIds = friendRequests.map((request) =>
      request.senderId === user.id ? request.receiverId : request.senderId,
    );

    // Get user details based on extracted IDs
    const usersList = await this.userService.getUsersListFromIds(userIds);
    return usersList;
  }

  // Get a friendlist of the current user
  async getFriends(user: User): Promise<ShowUsersDto> {
    const where = {
      isAccepted: true,
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    };

    const friendsList = await this.getUsersFromFriendRequests(user, where);
    return friendsList;
  }

  // Get a list of sent friend requests, by the current user
  async getSentFriendRequests(user: User): Promise<ShowUsersDto> {
    const where = { isAccepted: false, senderId: user.id };

    const pendingSentUserList = await this.getUsersFromFriendRequests(
      user,
      where,
    );
    return pendingSentUserList;
  }

  // Get a list of received friend requests by the current user
  async getReceivedFriendRequests(user: User): Promise<ShowUsersDto> {
    const where = { isAccepted: false, receiverId: user.id };

    const pendingReceivedUserList = await this.getUsersFromFriendRequests(
      user,
      where,
    );
    return pendingReceivedUserList;
  }

  // Send a friend request from the current user to another user
  async sendFriendRequest(
    sendingUser: User,
    invitedName: string,
  ): Promise<void> {
    const receivingUser = await this.userService.getUserByName(invitedName);

    // Check if a friend request already exists between these users
    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: sendingUser.id, receiverId: receivingUser.id },
          { senderId: receivingUser.id, receiverId: sendingUser.id },
        ],
      },
    });

    // Throw an exception if a request already exists
    if (existingRequest) {
      throw new BadRequestException(
        `There is already a friendRequest for '${sendingUser.username}' and '${invitedName}'`,
      );
    }

    // Create a new friend request record
    await this.prisma.friendRequest.create({
      data: { senderId: sendingUser.id, receiverId: receivingUser.id },
    });
  }

  // Accept a friend request from another user
  async acceptFriendRequest(
    acceptingUser: User,
    sendingName: string,
  ): Promise<void> {
    const invitingUser = await this.userService.getUserByName(sendingName);

    // Define criteria to find the pending friend request
    const where = {
      isAccepted: false,
      senderId_receiverId: {
        receiverId: acceptingUser.id,
        senderId: invitingUser.id,
      },
    };

    // Update the friend request to mark it as accepted
    await this.prisma.friendRequest.update({
      where,
      data: { isAccepted: true },
    });
  }

  // Delete a friend request or an existing friendship
  async deleteFriendRequest(user: User, otherUsername: string): Promise<void> {
    const otherUser = await this.userService.getUserByName(otherUsername);

    // Define criteria to find friend requests involving the users
    const where = {
      OR: [
        { receiverId: user.id, senderId: otherUser.id },
        { receiverId: otherUser.id, senderId: user.id },
      ],
    };

    // Delete the identified friend request(s)
    await this.prisma.friendRequest.deleteMany({
      where,
    });
  }
}
