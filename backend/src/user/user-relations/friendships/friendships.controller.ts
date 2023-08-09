import { Controller, Get, Param } from '@nestjs/common';

import { FriendshipsService } from './friendships.service';

@Controller('friends')
export class FriendshipsController {
  constructor(private friendshipsService: FriendshipsService) {}

  @Get(':username')
  async getFriends(@Param('username') name: string) {
    const friends = await this.friendshipsService.getFriends(name);
    return friends;
  }

  @Get('sent/:username')
  async getSentFriendRequests(@Param('username') name: string) {
    const users = await this.friendshipsService.getSentFriendRequests(name);
    return users;
  }

  @Get('received/:username')
  async getReceivedFriendRequests(@Param('username') name: string) {
    const users = await this.friendshipsService.getReceivedFriendRequests(name);
    return users;
  }
}
