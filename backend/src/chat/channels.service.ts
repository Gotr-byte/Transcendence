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

  async getNonPrivateChannels(userId: number): Promise<ShowChannelsDto> {
    const nonPrivateChannels = await this.prisma.channel.findMany({
      where: {
        channelType: { in: [ChannelTypes.PUBLIC, ChannelTypes.PROTECTED] },
        NOT: {
          restrictedUsers: {
            some: {
              restrictedUserId: userId,
              restrictionType: ChannelUserRestrictionTypes.BANNED,
            },
          },
        },
      },
    });

    return ShowChannelsDto.from(nonPrivateChannels);
  }

  async getUserChannels(userId: number): Promise<ShowChannelsDto> {
    const userMemberships = await this.prisma.channelMember.findMany({
      where: { userId },
      include: { channel: true },
    });

    const userChannels = await Promise.all(
      userMemberships.map(async (membership) => {
        const channel = await this.prisma.channel.findUniqueOrThrow({
          where: { id: membership.channelId },
        });
        return channel;
      }),
    );
    return ShowChannelsDto.from(userChannels);
  }

  async getChannel(channelId: number, userId: number): Promise<ShowChannelDto> {
    let channel = await this.getPublicProtectedChannel(channelId);
    if (!channel) {
      channel = await this.getPrivateChannel(channelId, userId);
    }

    const usersNo = await this.countChannelMembers(channel.id);

    return ShowChannelDto.from(channel, usersNo);
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


  private async getChannelForJoin(
    channelId: number,
    userId: number,
  ): Promise<Channel> {
    const channel = await this.prisma.channel.findUniqueOrThrow({
      where: {
        id: channelId,
        channelType: { in: [ChannelTypes.PUBLIC, ChannelTypes.PROTECTED] },
        NOT: {
          restrictedUsers: {
            some: {
              restrictedUserId: userId,
              restrictionType: ChannelUserRestrictionTypes.BANNED,
            },
          },
        },
      },
    });
    return channel;
  }

  private async verifyJoinChannel(
    channel: Channel,
    joinChannelDto: JoinChannelDto,
  ): Promise<void> {
    if (channel.channelType === ChannelTypes.PROTECTED) {
      const channelPassword = channel.password ?? '';

      if (!joinChannelDto.password) {
        throw new BadRequestException(
          'No Password provided for Protected Channel',
        );
      }

      const isValid = await argon.verify(
        channelPassword,
        joinChannelDto.password,
      );

      if (!isValid) {
        throw new UnauthorizedException('Incorrect password');
      }
    }
    if (channel.channelType === ChannelTypes.PRIVATE) {
      throw new UnauthorizedException('User is trying to Join Private Channel');
    }
  }
}
