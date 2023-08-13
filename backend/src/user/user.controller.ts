import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ShowUserDto, UpdateUserDto } from './dto';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/auth.decorator';

@UseGuards(AuthenticatedGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Get all users
  @Get('all')
  async getAll(): Promise<ShowUserDto[]> {
    const users = await this.userService.getAll();
    return users;
  }

  // Get user by username
  @Get(':username')
  async getUserByName(
    @Param('username') username: string,
  ): Promise<ShowUserDto> {
    const user = await this.userService.getUserByName(username);
    return user;
  }

  // Update user profile
  @Patch(':username')
  async updateUser(
    @Param('username') username: string,
    @AuthUser() user: User,
    @Body() dto: UpdateUserDto,
  ): Promise<ShowUserDto> {
    // Validate that the authenticated user is authorized to update the profile
    if (user.username != username)
      throw new ForbiddenException(
        `User: '${user.username} is not allowed to patch '${username}'`,
      );
    const updatedUser = await this.userService.updateUser(user, dto);
    console.log(`User: ${username} was updated`);
    return updatedUser;
  }
}
