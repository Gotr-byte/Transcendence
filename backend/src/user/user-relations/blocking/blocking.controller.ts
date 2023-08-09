import { Controller, Get, Param } from '@nestjs/common';

import { BlockingService } from './blocking.service';

@Controller('blocked')
export class BlockingController {
  constructor(private blockingService: BlockingService) {}

  @Get(':username')
  async getBlockedUsers(@Param('username') name: string) {
    // const blockedUsers
  }

  // @Get('by/:username')
}
