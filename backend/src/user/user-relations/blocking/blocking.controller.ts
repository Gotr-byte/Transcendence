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
import { ShowAnyUserDto } from 'src/user/dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthenticatedGuard)
@ApiTags('User-relations: Blocking')
@Controller('block')
export class BlockingController {
  constructor(private readonly blockingService: BlockingService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of users blocked by the current user' })
  async getBlockedUsers(@AuthUser() user: User): Promise<ShowAnyUserDto[]> {
    const users = await this.blockingService.getBlockedUsers(user);
    return users;
  }

  @Get('by')
  @ApiOperation({
    summary: 'Get a list of users who have blocked the current user',
  })
  async getBlockingUsers(@AuthUser() user: User): Promise<ShowAnyUserDto[]> {
    const users = await this.blockingService.getBlockingUsers(user);
    return users;
  }

  @Post('user/:username')
  @ApiOperation({ summary: 'Block a user by username' })
  @ApiParam({ name: 'username', description: 'Username of the user to block' })
  async blockUser(
    @AuthUser() user: User,
    @Param('username') blockUser: string,
  ): Promise<string> {
    await this.blockingService.blockUser(user, blockUser);
    return `User: '${blockUser}' successfully blocked`;
  }

  @Delete(':username')
  @ApiOperation({ summary: 'Unblock a user by username' })
  @ApiParam({
    name: 'username',
    description: 'Username of the user to unblock',
  })
  async unblockUser(
    @AuthUser() user: User,
    @Param('username') unblockUser: string,
  ): Promise<string> {
    await this.blockingService.unblockUser(user, unblockUser);
    return `User: '${unblockUser}' successfully unblocked`;
  }
}
