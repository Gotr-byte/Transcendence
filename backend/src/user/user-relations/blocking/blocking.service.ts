import { BadRequestException, Injectable } from '@nestjs/common';
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

  async checkBlockAction(blockingId: number, blockedId: number) {
    if (blockingId === blockedId) {
      throw new BadRequestException('Cannot perform this action on yourself');
    }
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

  async blockUser(blockingUser: string, blockedUser: string) {
    const blocking = await this.userService.getUserByName(blockingUser);
    const blocked = await this.userService.getUserByName(blockedUser);

    await this.checkBlockAction(blocked.id, blocking.id);

    const newBlock = await this.prisma.blocked.create({
      data: {
        blockingUserId: blocking.id,
        blockedUserId: blocked.id,
      },
    });
    return newBlock;
  }

  async unblockUser(blockingUser: string, blockedUser: string) {
    const blocking = await this.userService.getUserByName(blockingUser);
    const blocked = await this.userService.getUserByName(blockedUser);

    await this.checkBlockAction(blocked.id, blocking.id);

    await this.prisma.blocked.delete({
      where: {
        blockingUserId_blockedUserId: {
          blockedUserId: blocked.id,
          blockingUserId: blocking.id,
        },
      },
    });
  }
}
