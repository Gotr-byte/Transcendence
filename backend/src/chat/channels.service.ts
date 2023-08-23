import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto, ShowChannelDto, ShowChannelsDto } from './dto';
import { ChannelTypes, ChannelUserRestrictionTypes } from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async getNonPrivateChannels(userId: number): Promise<ShowChannelsDto> {
    const nonPrivateChannels = await this.prisma.channel.findMany({
      where: {
        channelType: {
          in: [ChannelTypes.PRIVATE, ChannelTypes.PROTECTED],
        },
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

    const channelsNo = nonPrivateChannels.length;
    console.log(channelsNo);

    return ShowChannelsDto.from(nonPrivateChannels);
  }

  async getUserChannels(userId: number): Promise<ShowChannelsDto> {
    const userMemberships = await this.prisma.channelMember.findMany({
      where: {
        userId,
      },
      include: {
        channel: true,
      },
    });

    const userChannels = await Promise.all(
      userMemberships.map(async (membership) => {
        const channel = await this.prisma.channel.findUniqueOrThrow({
          where: {
            id: membership.channelId,
          },
        });
        return channel;
      }),
    );
    return ShowChannelsDto.from(userChannels);
  }

  async getChannel(title: string, userId: number): Promise<ShowChannelDto> {
    let channel = await this.prisma.channel.findUnique({
      where: {
        title,
        channelType: {
          in: [ChannelTypes.PRIVATE, ChannelTypes.PROTECTED],
        },
      },
    });
    if (!channel) {
      channel = await this.prisma.channel.findUniqueOrThrow({
        where: {
          title,
        },
        include: {
          channelUsers: {
            where: {
              userId,
            },
          },
        },
      });
    }

    const usersNo = await this.prisma.channelMember.count({
      where: {
        channelId: channel.id,
      },
    });

    return ShowChannelDto.from(channel, usersNo);
  }
}
