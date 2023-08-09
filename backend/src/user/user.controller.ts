import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto, UpdateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
  async getUserByName(@Param('username') name: string) {
    try {
      const user = await this.userService.getUserByName(name);
      return user;
    } catch (error) {
      throw new ForbiddenException(`Username: ${name} not found`);
    }
  }

  @Patch(':username')
  async updateUser(
    @Param('username') name: string,
    @Body() dto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(name, dto);
      return updatedUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials already taken');
      }
      throw new ForbiddenException(`Username: ${name} could not be updated`);
    }
  }

  //just for development testing:
  @Post('add')
  async addUser(@Body() dto: AddUserDto) {
    try {
      const newUser = await this.userService.addUser(dto);
      return newUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials already taken');
      }
      throw new ForbiddenException('New user could not be added');
    }
  }
}
