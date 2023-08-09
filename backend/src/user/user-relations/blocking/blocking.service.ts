import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

type BlockedWhereInput = {
  blockedUserId?: number;
  blockingUserId?: number;
};

@Injectable()
export class BlockingService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  private async getUsersfromBlockedList(user: User, where: BlockedWhereInput) {
    const blockUser = await this.prisma.blocked.findMany({
      where,
    });

    const userIds = blockUser.map((block) =>
      block.blockingUserId === user.id
        ? block.blockedUserId
        : block.blockingUserId,
    );

    const usersList = await this.userService.getUsersListFromIds(userIds);
    return usersList;
  }

  async getBlockedUsers(name: string) {
    const user = await this.userService.findByUsername(name);
    const where = { blockingUserId: user.id };
    const blockedUsers = await this.getUsersfromBlockedList(user, where);
    return blockedUsers;
  }

  async getBlockingUsers(name: string) {
    const user = await this.userService.findByUsername(name);
    const where = { blockedUserId: user.id };
    const blockingUsers = await this.getUsersfromBlockedList(user, where);
    return blockingUsers;
  }
}
