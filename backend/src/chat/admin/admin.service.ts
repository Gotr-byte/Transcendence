import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedService } from '../shared/shared.service';
import { ChannelMemberRoles, User } from '@prisma/client';
import { ShowUsersRolesRestrictions } from './dto';
import { extendedChannel } from './types';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private readonly sharedService: SharedService,
  ) {}

  async getChannelUsersAsAdmin(userId: number, channelId: number): Promise<ShowUsersRolesRestrictions> {
    await this.ensureUserIsAdmin(userId, channelId);

    const channelUsers = await this.prisma.user.findMany({
      where: { followingChannels: { some: { channelId: channelId } } },
    });

    const usersProps = await Promise.all(
      channelUsers.map(async (user) => {
        const channel = await this.getUsersRolesRestrictions(channelId, user.id);
        return { user, channel };
      })
    );

    return ShowUsersRolesRestrictions.from(usersProps);
  }

  async getUsersRolesRestrictions(channelId: number, userId: number): Promise<extendedChannel | null>  {
    const props = this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        channelUsers: { where: { userId } },
        restrictedUsers: { where: { restrictedUserId: userId } },
      },
    });
    return props
  }

  async addUsersToChannel(
    userId: number,
    channelId: number,
    users: number[],
  ): Promise<number> {
    await this.ensureUserIsAdmin(userId, channelId);

    const addUsers = users.map((newUserId) => {
      return {
        userId: newUserId,
        channelId,
        role: ChannelMemberRoles.USER,
      };
    });

    const addedUsersNo = await this.sharedService.addUsers(addUsers);
    return addedUsersNo;
  }

  async kickUser(
    channelId: number,
    userId: number,
    adminId: number,
  ): Promise<void> {
    await this.ensureUserIsAdmin(adminId, channelId);
    await this.sharedService.deleteUserFromChannel(userId, channelId);
  }

  private async ensureUserIsAdmin(
    userId: number,
    channelId: number,
  ): Promise<void> {
    const adminship = await this.prisma.channelMember.findUnique({
      where: {
        userId_channelId: { userId, channelId },
        role: ChannelMemberRoles.ADMIN,
      },
    });
    if (!adminship)
      throw new ForbiddenException(
        `User with id: '${userId}' is not Admin of  of this channel (ID:${channelId})`,
      );
  }
}
