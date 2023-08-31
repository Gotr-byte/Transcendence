import { BadRequestException, Injectable } from '@nestjs/common';
import { Blocked, User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { BlockedWhereInput } from './types';
import { ShowUsersDto } from 'src/user/dto';

@Injectable()
export class BlockingService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // Get a list of users based on the provided where clause
  private async getUsersfromBlockedList(
    user: User,
    where: BlockedWhereInput,
  ): Promise<ShowUsersDto> {
    const blockUsers = await this.prisma.blocked.findMany({
      where,
    });

    // Extract user IDs from the block list
    const userIds = blockUsers.map((block) =>
      block.blockingUserId === user.id
        ? block.blockedUserId
        : block.blockingUserId,
    );

    // Get user details based on extracted IDs
    const usersList = await this.userService.getUsersListFromIds(userIds);
    return usersList;
  }

  // Check if blocking and blocked users are the same
  private async checkBlockAction(blockingId: number, blockedId: number) {
    if (blockingId === blockedId) {
      throw new BadRequestException('Cannot perform this action on yourself');
    }
  }

  // Get a list of users blocked by the current user
  async getBlockedUsers(user: User): Promise<ShowUsersDto> {
    const where = { blockingUserId: user.id };
    const blockedUsers = await this.getUsersfromBlockedList(user, where);
    return blockedUsers;
  }

  // Get a list of users who have blocked the current user
  async getBlockingUsers(user: User): Promise<ShowUsersDto> {
    const where = { blockedUserId: user.id };
    const blockingUsers = await this.getUsersfromBlockedList(user, where);
    return blockingUsers;
  }

  // Block a user by username
  async blockUser(blockingUser: User, blockedName: string): Promise<Blocked> {
    const blockedUser = await this.userService.getUserByName(blockedName);

    // Ensure the user is not blocking themselves
    await this.checkBlockAction(blockedUser.id, blockingUser.id);

    // Create a new block record
    const newBlock = await this.prisma.blocked.create({
      data: { blockingUserId: blockingUser.id, blockedUserId: blockedUser.id },
    });
    return newBlock;
  }

  // Unblock a user by username
  async unblockUser(blockingUser: User, blockedName: string): Promise<void> {
    const blockedUser = await this.userService.getUserByName(blockedName);

    // Ensure the user is not unblocking themselves
    await this.checkBlockAction(blockedUser.id, blockingUser.id);

    // Delete the block record
    await this.prisma.blocked.delete({
      where: {
        blockingUserId_blockedUserId: {
          blockedUserId: blockedUser.id,
          blockingUserId: blockingUser.id,
        },
      },
    });
  }
}
