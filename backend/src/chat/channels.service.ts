import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateChannelDto,
  ShowChannelDto,
  ShowChannelsDto,
} from './dto';
import {
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

  async countChannelMembers(channelId: number): Promise<number> {
    const usersNo = await this.prisma.channelMember.count({
      where: { channelId },
    });
    return usersNo;
  }

  async getChannel(channelId: number, userId: number): Promise<ShowChannelDto> {
    let channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
        channelType: { in: [ChannelTypes.PUBLIC, ChannelTypes.PROTECTED] },
      },
    });
    if (!channel) {
      channel = await this.prisma.channel.findUniqueOrThrow({
        where: { id: channelId },
        include: { channelUsers: { where: { userId } } },
      });
    }

    const usersNo = await this.countChannelMembers(channel.id);

    return ShowChannelDto.from(channel, usersNo);
  }

  async createChannel(
    creatorId: number,
    createChannelDto: CreateChannelDto,
  ): Promise<ShowChannelDto> {
    if (createChannelDto.channelType === ChannelTypes.PROTECTED) {
      const hash = await argon.hash(createChannelDto.password);
      createChannelDto.password = hash;
    }
    const channel = await this.prisma.channel.create({
      data: { creatorId, ...createChannelDto },
    });

    await this.addUsers([
      {
        userId: creatorId,
        channelId: channel.id,
        role: ChannelMemberRoles.ADMIN,
      },
    ]);
    return ShowChannelDto.from(channel, 1);
  }

  async addUsersToChannel(userId: number, channelId: number, users: number[]): Promise<number> {
    try {
      await this.prisma.channelMember.findUniqueOrThrow({
        where: {
          userId_channelId: { userId, channelId },
          role: ChannelMemberRoles.ADMIN,
        },
      });
    } catch {
      throw new ForbiddenException(
        `User with id: '${userId}' is not Admin of channelId: '${channelId}'`,
      );
    }

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
  async addUsers(channelMember: ChannelMember[]): Promise<number> {
    const batchPayload = await this.prisma.channelMember.createMany({
      data: channelMember,
    });
    return batchPayload.count;
  }

  
}
