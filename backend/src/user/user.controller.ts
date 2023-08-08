import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  async getAll() {
    try {
      const users = await this.userService.getAll();
      return users;
    } catch (error) {
      throw new ForbiddenException('No Users available');
    }
  }

  @Get()
  @Get(':username')
  async getUserByName(@Param('username') username: string) {
    try {
      const user = await this.userService.getUserByName(username);
      return user;
    } catch (error) {
      throw new ForbiddenException(`Username: ${username} Not found`);
    }
  }

  @Patch(':username')
  async updateUser(@Req() request: Request) {
    console.log(request.body);
    const validatedData = this.validateUpdate(request);
  }

  private validateUpdate(@Req() request: Request) {
    const allowedFields = ['is2FaActive', 'username', 'avatar'];

    const body = request.body;
  }
}
