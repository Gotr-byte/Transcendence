import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  JoinChannelDto,
  ShowChannelDto,
  ShowChannelsDto,
} from './dto';
import {
  Channel,
  ChannelMember,
  ChannelMemberRoles,
  ChannelTypes,
  ChannelUserRestrictionTypes,
} from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

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

    const addedUsersNo = await this.addUsers(addUsers);
    return addedUsersNo;
  }

  async joinChannel(
    userId: number,
    channelId: number,
    joinChannelDto: JoinChannelDto,
  ): Promise<void> {
    const channel = await this.getChannelForJoin(userId, channelId);
    await this.verifyJoinChannel(channel, joinChannelDto);

    await this.addUsers([
      {
        userId: userId,
        channelId: channel.id,
        role: ChannelMemberRoles.USER,
      },
    ]);
  }

  async leaveChannel(userId: number, channelId: number): Promise<void> {
    await this.deleteUserFromChannel(userId, channelId);
    const usersNo = await this.countChannelMembers(channelId);
    if (!usersNo) {
      await this.deleteAllChannelRestrictions(channelId);
      await this.deleteAllChannelMessages(channelId);
      await this.removeChannel(channelId);
    }
  }

  private async deleteAllChannelRestrictions(channelId: number): Promise<void> {
    await this.prisma.channelUserRestriction.deleteMany({
      where: { restrictedChannelId: channelId },
    });
  }

  private async deleteAllChannelMessages(channelId: number): Promise<void> {
    await this.prisma.message.deleteMany({ where: { channelId } });
  }

  private async removeChannel(channelId: number): Promise<void> {
    await this.prisma.channel.delete({ where: { id: channelId } });
  }

  private async deleteUserFromChannel(
    userId: number,
    channelId: number,
  ): Promise<void> {
    await this.prisma.channelMember.delete({
      where: { userId_channelId: { userId, channelId } },
    });
  }

  async kickUser(
    channelId: number,
    userId: number,
    adminId: number,
  ): Promise<void> {
    await this.ensureUserIsAdmin(adminId, channelId);
    await this.deleteUserFromChannel(userId, channelId);
  }

  private async countChannelMembers(channelId: number): Promise<number> {
    const usersNo = await this.prisma.channelMember.count({
      where: { channelId },
    });
    return usersNo;
  }

  private async getPublicProtectedChannel(
    channelId: number,
  ): Promise<Channel | null> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
        channelType: { in: [ChannelTypes.PUBLIC, ChannelTypes.PROTECTED] },
      },
    });
    return channel;
  }

  private async getPrivateChannel(
    channelId: number,
    userId: number,
  ): Promise<Channel> {
    const channel = await this.prisma.channel.findUniqueOrThrow({
      where: { id: channelId },
      include: { channelUsers: { where: { userId } } },
    });
    return channel;
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
