import { Controller, Get } from '@nestjs/common';

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
}
