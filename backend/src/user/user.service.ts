import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AddUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const users = await this.prisma.user.findMany({});
    return users.map(this.transformUser);
  }

  //i dont know if its necessary but ill leave it here
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return this.transformUser(user);
  }

  async getUsersListFromIds(userIds: number[]) {
    const userList = await Promise.all(
      userIds.map((userId) => this.getUserById(userId)),
    );
    return userList;
  }

  async getUserByName(username: string) {
    const user = await this.findByUsername(username);
    return this.transformUser(user);
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        username,
      },
    });
    return user;
  }

  async updateUser(username: string, dto: UpdateUserDto) {
    const user = await this.findByUsername(username);
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
        ...dto,
      },
    });

    return updatedUser;
  }

  async addUser(dto: AddUserDto) {
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
      },
    });
    return newUser;
  }

  private transformUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      OAuthName: user.OAuthName,
      email: user.email,
      createdAt: user.createdAt,
      avatar: user.avatar,
      isOnline: user.isOnline,
    };
  }
}
