import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ChannelMember, ChannelUserRestriction } from '@prisma/client';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomError } from 'src/shared/shared.errors';

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
    const removed = await this.prisma.channelMember.deleteMany({
      where: { userId, channelId },
    });
    if (removed.count === 0)
      throw new ConflictException('User is not on channel');
  }


  async getCurrentRestriction(
    channelId: number,
    userId: number,
  ): Promise<ChannelUserRestriction | null> {
    const restriction = await this.prisma.channelUserRestriction.findUnique({
      where: {
        restrictedUserId_restrictedChannelId: {
          restrictedUserId: userId,
          restrictedChannelId: channelId,
        },
      },
    });
    return restriction;
  }

  async ensureUserIsMember(channelId: number, userId: number): Promise<void> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId, channelUsers: { some: { userId } } },
    });
    if (!channel) {
      const errorMessage = `Channel: (ID:${channelId}) doesn't exist, is invisible, or user '${userId}' is not a member`;
      throw new CustomError(errorMessage, 'UNKNOWN_CHANNEL_ERROR');
    }
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

  async verifyChannelPresence(channelId: number): Promise<void> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    if (!channel)
      throw new NotFoundException(`Channel (ID:${channelId}) doesn't extist`);
  }
}
