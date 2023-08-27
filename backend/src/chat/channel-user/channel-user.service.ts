import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JoinChannelDto, ShowUsersRoles } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedService } from '../shared/shared.service';
import {
  Channel,
  ChannelMemberRoles,
  ChannelTypes,
  ChannelUserRestrictionTypes,
} from '@prisma/client';
import { ShowChannelDto, ShowChannelsDto } from '../shared/dto';
import * as argon from 'argon2';

@Injectable()
export class ChannelUserService {
  constructor(
    private prisma: PrismaService,
    private readonly sharedService: SharedService,
  ) {}

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
    const channel = await this.validateAndGetChannel(channelId, userId);

    const usersNo = await this.countChannelMembers(channel.id);

    return ShowChannelDto.from(channel, usersNo);
  }

  async getChannelUsers(
    userId: number,
    channelId: number,
  ): Promise<ShowUsersRoles> {
    await this.validateAndGetChannel(channelId, userId);

    const channelUsers = await this.prisma.channelMember.findMany({
      where: { channelId },
      include: { user: true },
    });

    return ShowUsersRoles.from(channelUsers);
  }

  async joinChannel(
    userId: number,
    channelId: number,
    joinChannelDto: JoinChannelDto,
  ): Promise<void> {
    const channel = await this.getChannelForJoin(userId, channelId);
    await this.verifyJoinChannel(channel, joinChannelDto);

    await this.sharedService.addUsers([
      {
        userId: userId,
        channelId: channel.id,
        role: ChannelMemberRoles.USER,
      },
    ]);
  }

  async leaveChannel(userId: number, channelId: number): Promise<void> {
    await this.sharedService.deleteUserFromChannel(userId, channelId);
    const usersNo = await this.countChannelMembers(channelId);
    if (!usersNo) {
      await this.sharedService.deleteAllChannelRestrictions(channelId);
      await this.sharedService.deleteAllChannelMessages(channelId);
      await this.sharedService.removeChannel(channelId);
    }
  }

  private async validateAndGetChannel(
    channelId: number,
    userId: number,
  ): Promise<Channel> {
    let channel = await this.getPublicProtectedChannel(channelId, userId);
    if (!channel) {
      channel = await this.getPrivateChannel(channelId, userId);
    }
    return channel;
  }

  private async getPublicProtectedChannel(
    channelId: number,
    userId: number,
  ): Promise<Channel | null> {
    const channel = await this.prisma.channel.findUnique({
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

  private async countChannelMembers(channelId: number): Promise<number> {
    const usersNo = await this.prisma.channelMember.count({
      where: { channelId },
    });
    return usersNo;
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
