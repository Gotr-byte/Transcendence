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
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private readonly sharedService: SharedService,
  ) {}

  async getNonMemberChannels(userId: number): Promise<ShowChannelsDto> {
    const nonPrivateChannels = await this.prisma.channel.findMany({
      where: {
        NOT: {
          channelUsers: { some: { userId } },
        },
        channelType: {
          in: [ChannelTypes.PUBLIC, ChannelTypes.PROTECTED],
        },
        restrictedUsers: {
          none: {
            restrictedUserId: userId,
            restrictionType: ChannelUserRestrictionTypes.BANNED,
          },
        },
      },
    });
    nonPrivateChannels.sort((a, b) => a.title.localeCompare(b.title));
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
    userChannels.sort((a, b) => a.title.localeCompare(b.title));
    return ShowChannelsDto.from(userChannels);
  }

  async getChannel(channelId: number, userId: number): Promise<ShowChannelDto> {
    const typesInScope = [ChannelTypes.PUBLIC, ChannelTypes.PROTECTED];
    const channel = await this.validateAndGetChannel(
      channelId,
      userId,
      typesInScope,
    );

    const usersNo = await this.countChannelMembers(channel.id);

    return ShowChannelDto.from(channel, usersNo);
  }

  async getChannelUsers(
    channelId: number,
    userId: number,
  ): Promise<ShowUsersRoles> {
    const typesInScope = [ChannelTypes.PUBLIC];
    await this.validateAndGetChannel(channelId, userId, typesInScope);

    const channelUsers = await this.prisma.channelMember.findMany({
      where: { channelId },
      include: { user: true },
    });

    return ShowUsersRoles.from(channelUsers);
  }

  async joinChannel(
    channelId: number,
    userId: number,
    joinChannelDto: JoinChannelDto,
  ): Promise<void> {
    const channel = await this.getChannelForJoin(channelId, userId);

    await this.verifyJoinChannel(channel, joinChannelDto);

    await this.sharedService.addUser({
      channelId: channel.id,
      userId: userId,
      role: ChannelMemberRoles.USER,
    });
  }

  async leaveChannel(channelId: number, userId: number): Promise<void> {
    await this.sharedService.deleteUserFromChannel(channelId, userId);
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
    channelTypes: ChannelTypes[],
  ): Promise<Channel> {
    let channel = await this.getNonMemberChannel(
      channelId,
      userId,
      channelTypes,
    );
    if (!channel) {
      channel = await this.getMemberChannel(channelId, userId);
    }
    return channel;
  }

  private async getNonMemberChannel(
    channelId: number,
    userId: number,
    channelTypes: ChannelTypes[],
  ): Promise<Channel | null> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
        channelType: { in: channelTypes },
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

  private async getMemberChannel(
    channelId: number,
    userId: number,
  ): Promise<Channel> {
    const channel = await this.prisma.channel.findUniqueOrThrow({
      where: { id: channelId, channelUsers: { some: { userId } } },
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
      const channelPassword = joinChannelDto.password ?? '';

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
