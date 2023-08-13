import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BlockingService } from './blocking.service';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';
import { ShowUserDto } from 'src/user/dto';

@UseGuards(AuthenticatedGuard)
@Controller('block')
export class BlockingController {
  constructor(private blockingService: BlockingService) {}

  // Get a list of users blocked by the current user
  @Get()
  async getBlockedUsers(@AuthUser() user: User): Promise<ShowUserDto[]> {
    const users = await this.blockingService.getBlockedUsers(user);
    return users;
  }

  // Get a list of users who have blocked the current user
  @Get('by')
  async getBlockingUsers(@AuthUser() user: User): Promise<ShowUserDto[]> {
    const users = await this.blockingService.getBlockingUsers(user);
    return users;
  }

  // Block a user by username
  @Post('/user/:username')
  async blockUser(
    @AuthUser() user: User,
    @Param('username') blockUser: string,
  ): Promise<string> {
    await this.blockingService.blockUser(user, blockUser);
    return `User: '${blockUser}' successfully blocked`;
  }

  // Unblock a user by username
  @Delete(':username')
  async unblockUser(
    @AuthUser() user: User,
    @Param('username') unblockUser: string,
  ): Promise<string> {
    await this.blockingService.unblockUser(user, unblockUser);
    return `User: '${unblockUser}' successfully unblocked`;
  }
}
