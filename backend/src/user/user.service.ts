import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import {
  ChangeUserDto,
  ChangeUserPropsDto,
  ShowAnyUserDto,
  ShowLoggedUserDto,
  ShowUsersDto,
} from './dto';
import { UserDetails } from './types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Get a list of all users
  async getAll(): Promise<ShowUsersDto> {
    const users = await this.prisma.user.findMany({});
    return ShowUsersDto.from(users);
  }

  // Find a user by their username
  async getUserByName(username: string): Promise<User> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });

    return user;
  }

  // Get user details by ID
  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return user;
  }

  // Get user details by email
  async getUserByEmail(userEmail: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });
    return user;
  }

  // Get a list of users based on their IDs
  async getUsersListFromIds(userIds: number[]): Promise<ShowUsersDto> {
    const userList = await Promise.all(
      userIds.map((userId) => this.getUserById(userId)),
    );
    return ShowUsersDto.from(userList);
  }

  // Update user profile
  async updateUser(
    user: User,
    dto: ChangeUserDto | ChangeUserPropsDto,
  ): Promise<ShowLoggedUserDto> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { ...dto },
    });
    return ShowLoggedUserDto.from(updatedUser);
  }

  // Create a new user
  async createUser(details: UserDetails): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: { ...details },
    });
    return newUser;
  }
}
