import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedService } from '../shared/shared.service';
import {
  ChannelMember,
  ChannelMemberRoles,
  ChannelUserRestriction,
  ChannelUserRestrictionTypes,
} from '@prisma/client';
import {
  CreateRestrictionDto,
  ShowUsersRestrictions,
  ShowUsersRolesRestrictions,
} from './dto';
import { extendedChannel } from './types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private readonly sharedService: SharedService,
    private readonly userService: UserService,
  ) {}

  async getChannelUsersAsAdmin(
    channelId: number,
    adminId: number,
  ): Promise<ShowUsersRolesRestrictions> {
    await this.ensureUserIsAdmin(channelId, adminId);

    const channelUsers = await this.prisma.user.findMany({
      where: { followingChannels: { some: { channelId: channelId } } },
    });

    const usersProps = await Promise.all(
      channelUsers.map(async (user) => {
        const channel = await this.getUserRoleRestriction(channelId, user.id);
        return { user, channel };
      }),
    );

    return ShowUsersRolesRestrictions.from(usersProps);
  }

  async getRestrictedUsers(
    channelId: number,
    adminId: number,
  ): Promise<ShowUsersRestrictions> {
    await this.ensureUserIsAdmin(channelId, adminId);

    const allRestrictions = await this.prisma.channelUserRestriction.findMany({
      where: { restrictedChannelId: channelId },
    });

    const usersProps = await Promise.all(
      allRestrictions.map(async (restriction) => {
        const user = await this.userService.getUserById(
          restriction.restrictedUserId,
        );
        return { restriction, user };
      }),
    );

    return ShowUsersRestrictions.from(usersProps);
  }

  async addUserToChannel(
    channelId: number,
    adminId: number,
    username: string,
  ): Promise<ChannelMember> {
    await this.ensureUserIsAdmin(channelId, adminId);
    const user = await this.userService.getUserByName(username);

    await this.verifyAccessPermission(channelId, user.id);

    const addUser = {
      userId: user.id,
      channelId,
      role: ChannelMemberRoles.USER,
    };

    const newMembership = await this.sharedService.addUser(addUser);
    return newMembership;
  }

  async restrictUser(
    channelId: number,
    username: string,
    adminId: number,
    createRestrictionDto: CreateRestrictionDto,
  ): Promise<ChannelUserRestriction> {
    const userId = await this.validateAdminAction(channelId, username, adminId);

    if (
      createRestrictionDto.restrictionType ===
      ChannelUserRestrictionTypes.BANNED
    ) {
      await this.sharedService.deleteUserFromChannel(channelId, userId);
    }

    const newRestriction = await this.createRestriction(
      channelId,
      userId,
      createRestrictionDto,
    );
    return newRestriction;
  }

  async liberateUser(
    channelId: number,
    username: string,
    adminId: number,
  ): Promise<void> {
    await this.ensureUserIsAdmin(channelId, adminId);
    const user = await this.userService.getUserByName(username);

    this.prisma.channelUserRestriction.delete({
      where: {
        restrictedUserId_restrictedChannelId: {
          restrictedUserId: user.id,
          restrictedChannelId: channelId,
        },
      },
    });
  }

  private async createRestriction(
    channelId: number,
    userId: number,
    createRestrictionDto: CreateRestrictionDto,
  ): Promise<ChannelUserRestriction> {
    const newRestriction = await this.prisma.channelUserRestriction.create({
      data: {
        restrictedUserId: userId,
        restrictedChannelId: channelId,
        ...createRestrictionDto,
      },
    });
    return newRestriction;
  }

  async kickUser(
    channelId: number,
    username: string,
    adminId: number,
  ): Promise<void> {
    const userId = await this.validateAdminAction(channelId, username, adminId);

    await this.sharedService.deleteUserFromChannel(channelId, userId);
  }

  private async verifyAccessPermission(
    channelId: number,
    userId: number,
  ): Promise<void> {
    const restriction = await this.prisma.channelUserRestriction.findUnique({
      where: {
        restrictedUserId_restrictedChannelId: {
          restrictedChannelId: channelId,
          restrictedUserId: userId,
        },
        restrictionType: ChannelUserRestrictionTypes.BANNED,
      },
    });
    if (restriction)
      throw new BadRequestException(
        `User with id: '${userId}' is banned on this channel (ID: ${channelId})`,
      );
  }

  private async validateAdminAction(
    channelId: number,
    username: string,
    adminId: number,
  ): Promise<number> {
    await this.ensureUserIsAdmin(channelId, adminId);
    const user = await this.userService.getUserByName(username);
    await this.ensureUserIsNotCreator(channelId, user.id);
    await this.ensureUserIsMember(channelId, user.id);
    return user.id;
  }

  private async ensureUserIsAdmin(
    channelId: number,
    adminId: number,
  ): Promise<void> {
    const adminship = await this.prisma.channelMember.findUnique({
      where: {
        userId_channelId: { userId: adminId, channelId },
        role: ChannelMemberRoles.ADMIN,
      },
    });
    if (!adminship)
      throw new ForbiddenException(
        `User with id: '${adminId}' is not Admin of  of this channel (ID:${channelId})`,
      );
  }

  private async ensureUserIsNotCreator(
    channelId: number,
    userId: number,
  ): Promise<void> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId, creatorId: userId },
    });
    if (channel)
      throw new BadRequestException(
        `User with id: '${userId}' the creator of this channel (ID: ${channelId})`,
      );
  }

  private async ensureUserIsMember(
    channelId: number,
    userId: number,
  ): Promise<void> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId, channelUsers: { some: { userId } } },
    });
    if (!channel)
      throw new BadRequestException(
        `User with id: '${userId}' is not a member of this channel (ID: ${channelId})`,
      );
  }

  private async getUserRoleRestriction(
    channelId: number,
    userId: number,
  ): Promise<extendedChannel> {
    const props = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        channelUsers: { where: { userId } },
        restrictedUsers: { where: { restrictedUserId: userId } },
      },
    });

    if (!props)
      throw new InternalServerErrorException(
        'Error when Getting Users Details for Admin',
      );
    return props;
  }
}
