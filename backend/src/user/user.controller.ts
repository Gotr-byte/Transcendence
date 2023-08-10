import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto, UpdateUserDto } from './dto';
import { AuthGuard42 } from 'src/auth/guards/Guards';

@UseGuards(AuthGuard42)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  async getAll() {
    const users = await this.userService.getAll();
    return users;
  }

  @Get(':username')
  async getUserByName(@Param('username') name: string) {
    const user = await this.userService.getUserByName(name);
    return user;
  }

  @Patch(':username')
  async updateUser(
    @Param('username') name: string,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(name, dto);
    return updatedUser;
  }

  //just for development testing:
  @Post('add')
  async addUser(@Body() dto: AddUserDto) {
    const newUser = await this.userService.addUser(dto);
    return newUser;
  }
}
