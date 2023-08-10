import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { BlockingService } from './blocking.service';

@Controller('block')
export class BlockingController {
  constructor(private blockingService: BlockingService) {}

  @Get('blocked')
  async getBlockedUsers() {
    const username = 'LOGGED-IN-USER'; //
    const users = await this.blockingService.getBlockedUsers(username);
    return users;
  }

  @Get('blockedby')
  async getBlockingUsers() {
    const username = 'LOGGED-IN-USER'; //
    const users = await this.blockingService.getBlockingUsers(username);
    return users;
  }

  @Post('/user/:username')
  async blockUser(@Param('username') blockUser: string) {
    const username = 'LOGGED-IN-USER'; //
    await this.blockingService.blockUser(username, blockUser);
    return { msg: `User: '${blockUser}' successfully blocked` };
  }

  @Delete(':username')
  async unblockUser(@Param('username') unblockUser: string) {
    const username = 'LOGGED-IN-USER'; //
    const users = await this.blockingService.unblockUser(username, unblockUser);
    return { msg: `User: '${unblockUser}' successfully unblocked` };
  }
}
