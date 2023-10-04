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
import { AuthenticatedGuard } from 'src/auth/guards/http-guards';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/auth.decorator';
import { ShowUsersDto } from 'src/user/dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthenticatedGuard)
@Controller('friends')
@ApiTags('User-relations: Friendship')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Get()
  @ApiOperation({ summary: 'Get the list of friends for the current user' })
  async getFriends(@AuthUser() user: User): Promise<ShowUsersDto> {
    const friends = await this.friendshipsService.getFriends(user);
    return friends;
  }

  @Get('sent')
  @ApiOperation({
    summary: 'Get a list of sent friend requests by the current user',
  })
  async getSentFriendRequests(@AuthUser() user: User): Promise<ShowUsersDto> {
    const users = await this.friendshipsService.getSentFriendRequests(user);
    return users;
  }

  @Get('received')
  @ApiOperation({
    summary: 'Get a list of received friend requests by the current user',
  })
  async getReceivedFriendRequests(
    @AuthUser() user: User,
  ): Promise<ShowUsersDto> {
    const users = await this.friendshipsService.getReceivedFriendRequests(user);
    return users;
  }

  @Post(':username')
  @ApiOperation({ summary: 'Send a friend request to another user' })
  @ApiParam({
    name: 'username',
    description: 'Username of the user to send the friend request to',
  })
  async sendFriendRequest(
    @AuthUser() user: User,
    @Param('username') receiver: string,
  ): Promise<string> {
    await this.friendshipsService.sendFriendRequest(user, receiver);
    return `'${user.username}' sent a friendReqest to '${receiver}'`;
  }

  @Patch(':username')
  @ApiOperation({ summary: 'Accept a friend request from another user' })
  @ApiParam({
    name: 'username',
    description: 'Username of the user who sent the friend request',
  })
  async acceptFriendRequest(
    @AuthUser() user: User,
    @Param('username') inviter: string,
  ): Promise<string> {
    await this.friendshipsService.acceptFriendRequest(user, inviter);
    return `'${user.username}' and '${inviter}' are now friends`;
  }

  @Delete(':username')
  @ApiOperation({ summary: 'Delete a friend request or existing friendship' })
  @ApiParam({
    name: 'username',
    description: 'Username of the user to delete friendship with',
  })
  async deleteFriendRequest(
    @AuthUser() user: User,
    @Param('username') otherUser: string,
  ): Promise<string> {
    await this.friendshipsService.deleteFriendRequest(user, otherUser);
    return `'${user.username}' and '${otherUser}' doesn't have a friendship or open requests`;
  }
}
