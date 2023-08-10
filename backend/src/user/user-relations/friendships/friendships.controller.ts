import { Controller, InternalServerErrorException, Get } from '@nestjs/common';

import { FriendshipsService } from './friendships.service';

@Controller('friends')
export class FriendshipsController {
  constructor(private friendshipsService: FriendshipsService) {}

  @Get()
  async getFriends() {
    try {
      const username = 'LOGGED-IN-USER'; //
      const friends = await this.friendshipsService.getFriends(username);
      return friends;
    } catch (error) {
      throw new InternalServerErrorException('Error getting friends');
    }
  }

  @Get('sent')
  async getSentFriendRequests() {
    try {
      const username = 'LOGGED-IN-USER'; //
      const users = await this.friendshipsService.getSentFriendRequests(
        username,
      );
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting sent friend requests',
      );
    }
  }

  @Get('received')
  async getReceivedFriendRequests() {
    try {
      const username = 'LOGGED-IN-USER'; //
      const users = await this.friendshipsService.getReceivedFriendRequests(
        username,
      );
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting received friend requests',
      );
    }
  }
}
