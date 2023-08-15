import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { FriendshipsService } from './friendships.service';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/auth.decorator';
import { ShowAnyUserDto } from 'src/user/dto';

@UseGuards(AuthenticatedGuard)
@Controller('friends')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  // Get the list of friends for the current user
  @Get()
  async getFriends(@AuthUser() user: User): Promise<ShowAnyUserDto[]> {
    const friends = await this.friendshipsService.getFriends(user);
    return friends;
  }

  // Get a list of sent friend requests by the current user
  @Get('sent')
  async getSentFriendRequests(
    @AuthUser() user: User,
  ): Promise<ShowAnyUserDto[]> {
    const users = await this.friendshipsService.getSentFriendRequests(user);
    return users;
  }

  // Get a list of received friend requests by the current user
  @Get('received')
  async getReceivedFriendRequests(
    @AuthUser() user: User,
  ): Promise<ShowAnyUserDto[]> {
    const users = await this.friendshipsService.getReceivedFriendRequests(user);
    return users;
  }

  // Send a friend request to another user
  @Post(':username')
  async sendFriendRequest(
    @AuthUser() user: User,
    @Param('username') receiver: string,
  ): Promise<string> {
    await this.friendshipsService.sendFriendRequest(user, receiver);
    return `'${user.username}' sent a friendReqest to '${receiver}' are now friends`;
  }

  // Accept a friend request from another user
  @Patch(':username')
  async acceptFriendRequest(
    @AuthUser() user: User,
    @Param('username') inviter: string,
  ): Promise<string> {
    await this.friendshipsService.acceptFriendRequest(user, inviter);
    return `'${user.username}' and '${inviter}' are now friends`;
  }

  // Delete a friend request or existing friendship
  @Delete(':username')
  async deleteFriendRequest(
    @AuthUser() user: User,
    @Param('username') otherUser: string,
  ): Promise<string> {
    await this.friendshipsService.deleteFriendRequest(user, otherUser);
    return `'${user.username}' and '${otherUser}' doesn't have a friendship or open requests`;
  }
}
