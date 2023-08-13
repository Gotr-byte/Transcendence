import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto, ShowUserDto } from './dto';
import { UserDetails } from './types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Get a list of all users
  async getAll(): Promise<ShowUserDto[]> {
    const users = await this.prisma.user.findMany({});
    const userDtos = users.map((user) => ShowUserDto.from(user));
    return userDtos;
  }

  // Find a user by their username
  async getUserByName(username: string): Promise<ShowUserDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        username,
      },
    });

    return ShowUserDto.from(user);
  }

  // Get user details by ID
  async getUserById(id: number): Promise<ShowUserDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return ShowUserDto.from(user);
  }

  // Get user details by email
  async getUserByEmail(userEmail: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    return user;
  }

  // Get a list of users based on their IDs
  async getUsersListFromIds(userIds: number[]): Promise<ShowUserDto[]> {
    const userList = await Promise.all(
      userIds.map((userId) => this.getUserById(userId)),
    );
    return userList;
  }

  // Update user profile
  async updateUser(user: User, dto: UpdateUserDto): Promise<ShowUserDto> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
        ...dto,
      },
    });
    return ShowUserDto.from(updatedUser);
  }

  // Create a new user
  async createUser(details: UserDetails): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        ...details,
      },
    });
    return newUser;
  }
}
