import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ShowAnyUserDto, ChangeUserDto, ShowLoggedUserDto } from './dto';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/auth.decorator';

@UseGuards(AuthenticatedGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Get all users
  @Get('all')
  async getAll(): Promise<ShowAnyUserDto[]> {
    const users = await this.userService.getAll();
    return users;
  }

  // Get user by username
  @Get(':username')
  async getUserByName(
    @Param('username') username: string,
  ): Promise<ShowLoggedUserDto | ShowAnyUserDto> {
    const user = await this.userService.getUserByName(username);
    return user.username === username
      ? ShowLoggedUserDto.from(user)
      : ShowAnyUserDto.from(user);
  }

  // Update user profile
  @Patch(':username')
  async updateUser(
    @Param('username') username: string,
    @AuthUser() user: User,
    @Body(new ValidationPipe()) dto: ChangeUserDto,
  ): Promise<ShowLoggedUserDto> {
    // Validate that the authenticated user is authorized to update the profile
    if (user.username != username)
      throw new ForbiddenException(
        `User: '${user.username} is not allowed to patch '${username}'`,
      );
    const updatedUser = await this.userService.updateUser(user, dto);
    return updatedUser;
  }
}
