import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatSharedService } from '../shared/chat-shared.service';
import {
  ChannelMember,
  ChannelMemberRoles,
  ChannelUserRestriction,
  ChannelUserRestrictionTypes,
} from '@prisma/client';
import {
  RestrictionDto,
  ShowUsersRestrictions,
  ShowUsersRolesRestrictions,
  UpdateRoleDto,
} from './dto';
import { extendedChannel } from './types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private readonly chatSharedService: ChatSharedService,
    private readonly userService: UserService,
  ) {}

  async getChannelUsersAsAdmin(
    channelId: number,
    adminId: number,
  ): Promise<ShowUsersRolesRestrictions> {
    await this.chatSharedService.verifyChannelPresence(channelId);
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
    await this.chatSharedService.verifyChannelPresence(channelId);
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
    await this.chatSharedService.verifyChannelPresence(channelId);
    await this.ensureUserIsAdmin(channelId, adminId);
    const user = await this.userService.getUserByName(username);

    await this.verifyAccessPermission(channelId, user.id);

    const addUser = {
      userId: user.id,
      channelId,
      role: ChannelMemberRoles.USER,
    };

    const newMembership = await this.chatSharedService.addUser(addUser);
    return newMembership;
  }

  async createOrUpdateRestriction(
    channelId: number,
    username: string,
    adminId: number,
    restrictionDto: RestrictionDto,
  ): Promise<ChannelUserRestriction> {
    await this.chatSharedService.verifyChannelPresence(channelId);
    const userId = await this.validateAdminAction(channelId, username, adminId);
    if (
      restrictionDto.restrictionType === ChannelUserRestrictionTypes.BANNED &&
      (await this.userIsOnChannel(channelId, userId))
    ) {
      await this.chatSharedService.deleteUserFromChannel(channelId, userId);
    }

    let restriction: ChannelUserRestriction;
    if (restrictionDto.actionType === 'create') {
      restriction = await this.createRestriction(
        channelId,
        userId,
        restrictionDto,
      );
    } else if (restrictionDto.actionType === 'update') {
      restriction = await this.updateRestriction(
        channelId,
        userId,
        restrictionDto,
      );
    } else {
      throw new InternalServerErrorException(
        'Error while creating/updating user restriction',
      );
    }
    return restriction;
  }

  async updateRole(
    channelId: number,
    username: string,
    adminId: number,
    updateRole: UpdateRoleDto,
  ): Promise<ChannelMember> {
    await this.chatSharedService.verifyChannelPresence(channelId);
    const userId = await this.validateAdminAction(channelId, username, adminId);

    const membership = await this.prisma.channelMember.update({
      where: { userId_channelId: { userId, channelId } },
      data: { ...updateRole },
    });

    if (updateRole.role === ChannelMemberRoles.ADMIN)
      await this.checkAdminAchievement(username);
    return membership;
  }

  private async checkAdminAchievement(username: string): Promise<void> {
    const user = await this.userService.getUserByName(username);
    if (!user.achievements.includes('ADMINISTART'))
      await this.userService.addAchievement(user.id, 'ADMINISTART');
  }

  async liberateUser(
    channelId: number,
    username: string,
    adminId: number,
  ): Promise<void> {
    await this.chatSharedService.verifyChannelPresence(channelId);
    await this.ensureUserIsAdmin(channelId, adminId);
    const user = await this.userService.getUserByName(username);

    await this.prisma.channelUserRestriction.delete({
      where: {
        restrictedUserId_restrictedChannelId: {
          restrictedUserId: user.id,
          restrictedChannelId: channelId,
        },
      },
    });
  }

  async kickUser(
    channelId: number,
    username: string,
    adminId: number,
  ): Promise<void> {
    await this.chatSharedService.verifyChannelPresence(channelId);
    const userId = await this.validateAdminAction(channelId, username, adminId);

    await this.chatSharedService.deleteUserFromChannel(channelId, userId);
  }

  private async createRestriction(
    restrictedChannelId: number,
    restrictedUserId: number,
    createRestrictionDto: RestrictionDto,
  ): Promise<ChannelUserRestriction> {
    const newRestriction = await this.prisma.channelUserRestriction.create({
      data: {
        restrictedChannelId,
        restrictedUserId,
        restrictionType: createRestrictionDto.restrictionType,
        duration: createRestrictionDto.duration,
      },
    });
    return newRestriction;
  }

  private async updateRestriction(
    restrictedChannelId: number,
    restrictedUserId: number,
    updateRestrictionDto: RestrictionDto,
  ): Promise<ChannelUserRestriction> {
    const updatedRestriction = await this.prisma.channelUserRestriction.update({
      where: {
        restrictedUserId_restrictedChannelId: {
          restrictedUserId,
          restrictedChannelId,
        },
      },
      data: {
        restrictionType: updateRestrictionDto.restrictionType,
        duration: updateRestrictionDto.duration,
      },
    });
    return updatedRestriction;
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
    await this.chatSharedService.ensureUserIsMember(channelId, user.id);
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
      throw new UnauthorizedException(
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

  private async userIsOnChannel(channelId: number, userId: number) {
    const user = await this.prisma.channelMember.findUnique({
      where: { userId_channelId: { userId, channelId } },
    });
    return !user ? false : true;
  }
}


// 1   | Client connected with ID: n1tNy3-sSk24XoB_AAAB
// transcendence1-backend-1   | Map(1) { 'n1tNy3-sSk24XoB_AAAB' => 12 }
// transcendence1-frontend-1  | files in the public directory are served at the root path.
// transcendence1-frontend-1  | Instead of /public/1920paper.jpg, use /1920paper.jpg.
// transcendence1-backend-1   | Map(0) {}
// transcendence1-backend-1   | Client disconnected with ID: n1tNy3-sSk24XoB_AAAB
// transcendence1-frontend-1  | files in the public directory are served at the root path.
// transcendence1-frontend-1  | Instead of /public/bookCover.jpg, use /bookCover.jpg.
// transcendence1-frontend-1  | files in the public directory are served at the root path.
// transcendence1-frontend-1  | Instead of /public/1920paper.jpg, use /1920paper.jpg.
// transcendence1-backend-1   | Client connected with ID: TzhdORexcrgZIl_WAAAD
// transcendence1-backend-1   | Map(1) { 'TzhdORexcrgZIl_WAAAD' => 12 }
// transcendence1-backend-1   | [Nest] 19156  - 11/03/2023, 8:49:22 AM   ERROR [ExceptionsHandler]
// transcendence1-backend-1   | Invalid `this.prisma.channelMember.update()` invocation in
// transcendence1-backend-1   | /app/src/chat/admin/admin.service.ts:137:56
// transcendence1-backend-1   |
// transcendence1-backend-1   |   134 ): Promise<ChannelMember> {
// transcendence1-backend-1   |   135   const userId = await this.validateAdminAction(channelId, username, adminId);
// transcendence1-backend-1   |   136
// transcendence1-backend-1   | → 137   const membership = await this.prisma.channelMember.update({
// transcendence1-backend-1   |           where: {
// transcendence1-backend-1   |             userId_channelId: {
// transcendence1-backend-1   |               userId: 10,
// transcendence1-backend-1   |               channelId: 4
// transcendence1-backend-1   |             }
// transcendence1-backend-1   |           },
// transcendence1-backend-1   |           data: {
// transcendence1-backend-1   |             role: "MEMBER"
// transcendence1-backend-1   |                   ~~~~~~~~
// transcendence1-backend-1   |           }
// transcendence1-backend-1   |         })
// transcendence1-backend-1   |
// transcendence1-backend-1   | Invalid value for argument `role`. Expected ChannelMemberRoles.
// transcendence1-backend-1   | PrismaClientValidationError:
// transcendence1-backend-1   | Invalid `this.prisma.channelMember.update()` invocation in
// transcendence1-backend-1   | /app/src/chat/admin/admin.service.ts:137:56
// transcendence1-backend-1   |
// transcendence1-backend-1   |   134 ): Promise<ChannelMember> {
// transcendence1-backend-1   |   135   const userId = await this.validateAdminAction(channelId, username, adminId);
// transcendence1-backend-1   |   136
// transcendence1-backend-1   | → 137   const membership = await this.prisma.channelMember.update({
// transcendence1-backend-1   |           where: {
// transcendence1-backend-1   |             userId_channelId: {
// transcendence1-backend-1   |               userId: 10,
// transcendence1-backend-1   |               channelId: 4
// transcendence1-backend-1   |             }
// transcendence1-backend-1   |           },
// transcendence1-backend-1   |           data: {
// transcendence1-backend-1   |             role: "MEMBER"
// transcendence1-backend-1   |                   ~~~~~~~~
// transcendence1-backend-1   |           }
// transcendence1-backend-1   |         })
// transcendence1-backend-1   |
// transcendence1-backend-1   | Invalid value for argument `role`. Expected ChannelMemberRoles.
// transcendence1-backend-1   |     at En (/app/node_modules/@prisma/client/runtime/library.js:116:5888)
// transcendence1-backend-1   |     at Cn.handleRequestError (/app/node_modules/@prisma/client/runtime/library.js:123:6516)
// transcendence1-backend-1   |     at Cn.handleAndLogRequestError (/app/node_modules/@prisma/client/runtime/library.js:123:6206)
// transcendence1-backend-1   |     at Cn.request (/app/node_modules/@prisma/client/runtime/library.js:123:5926)
// transcendence1-backend-1   |     at l (/app/node_modules/@prisma/client/runtime/library.js:128:9968)
// transcendence1-backend-1   |     at AdminService.updateRole (/app/src/chat/admin/admin.service.ts:137:24)
// transcendence1-backend-1   |     at AdminController.updateRole (/app/src/chat/admin/admin.controller.ts:166:24)
// transcendence1-backend-1   |     at /app/node_modules/@nestjs/core/router/router-execution-context.js:46:28
// transcendence1-backend-1   |     at /app/node_modules/@nestjs/core/router/router-proxy.js:9:17