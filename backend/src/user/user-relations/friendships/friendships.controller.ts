import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { FriendshipsService } from './friendships.service';

@Controller('friends')
export class FriendshipsController {
  constructor(private friendshipsService: FriendshipsService) {}

  @Get()
  async getFriends() {
    const username = 'LOGGED-IN-USER'; //
    const friends = await this.friendshipsService.getFriends(username);
    return friends;
  }

  @Get('sent')
  async getSentFriendRequests() {
    const username = 'LOGGED-IN-USER'; //
    const users = await this.friendshipsService.getSentFriendRequests(username);
    return users;
  }

  @Get('received')
  async getReceivedFriendRequests() {
    const username = 'LOGGED-IN-USER'; //
    const users = await this.friendshipsService.getReceivedFriendRequests(
      username,
    );
    return users;
  }

  @Post(':username')
  async sendFriendRequest(@Param('username') receiver: string) {
    const username = 'LOGGED-IN-USER'; //
    await this.friendshipsService.sendFriendRequest(username, receiver);
    return {
      msg: `'${username}' sent a friendReqest to '${receiver}' are now friends`,
    };
  }

  @Patch(':username')
  async acceptFriendRequest(@Param('username') inviter: string) {
    const username = 'LOGGED-IN-USER'; //
    await this.friendshipsService.acceptFriendRequest(username, inviter);
    return { msg: `'${username}' and '${inviter}' are now friends` };
  }

  //deletes Friends and open friend requests
  @Delete(':username')
  async deleteFriendRequest(@Param('username') otherUser: string) {
    const username = 'LOGGED-IN-USER'; //
    console.log(otherUser);
    console.log(username);
    await this.friendshipsService.deleteFriendRequest(username, otherUser);
    return {
      msg: `'${username}' and '${otherUser}' doesn't have a friendship or open requests`,
    };
  }
}
