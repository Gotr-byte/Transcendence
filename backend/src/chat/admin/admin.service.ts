import { ForbiddenException, Injectable } from '@nestjs/common';
import { AddUsersDto } from './dto/add-users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedService } from '../shared/shared.service';
import { ChannelMemberRoles } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private readonly sharedService: SharedService) {}

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
