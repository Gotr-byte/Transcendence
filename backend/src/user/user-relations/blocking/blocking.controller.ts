import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Req,
} from '@nestjs/common';

import { BlockingService } from './blocking.service';

@Controller('blocked')
export class BlockingController {
  constructor(private blockingService: BlockingService) {}

  @Get()
  async getBlockedUsers() {
    try {
      const username = 'LOGGED-IN-USER'; //
      const users = await this.blockingService.getBlockedUsers(username);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while getting blocked Users',
      );
    }
  }

  @Get('by')
  async getBlockingUsers() {
    try {
      const username = 'LOGGED-IN-USER'; //
      const users = await this.blockingService.getBlockingUsers(username);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while getting blocking Users',
      );
    }
  }
}
