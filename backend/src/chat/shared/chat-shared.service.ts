import { BadRequestException, Injectable } from '@nestjs/common';
import { ChannelMember } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatSharedService {
  constructor(private prisma: PrismaService) {}

  async addUser(channelMember: ChannelMember): Promise<ChannelMember> {
    const newMembership = await this.prisma.channelMember.create({
      data: channelMember,
    });
    return newMembership;
  }

  async deleteAllChannelRestrictions(channelId: number): Promise<void> {
    await this.prisma.channelUserRestriction.deleteMany({
      where: { restrictedChannelId: channelId },
    });
  }

  async deleteAllChannelMessages(channelId: number): Promise<void> {
    await this.prisma.message.deleteMany({ where: { channelId } });
  }

  async removeChannel(channelId: number): Promise<void> {
    await this.prisma.channel.delete({ where: { id: channelId } });
  }

  async deleteUserFromChannel(
    channelId: number,
    userId: number,
  ): Promise<void> {
    await this.prisma.channelMember.delete({
      where: { userId_channelId: { userId, channelId } },
    });
  }

  async ensureUserIsMember(channelId: number, userId: number): Promise<void> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId, channelUsers: { some: { userId } } },
    });
    if (!channel)
      throw new BadRequestException(
        `User with id: '${userId}' is not a member of this channel (ID: ${channelId})`,
      );
  }

  async removeExpiredChannelRestrictions(userId: number) {
    const currentTime = new Date();
    await this.prisma.channelUserRestriction.deleteMany({
      where: {
        restrictedUserId: userId,
        duration: {
          lt: currentTime,
        },
      },
    });
  }
}
