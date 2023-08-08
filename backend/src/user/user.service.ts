import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        OAuthName: true,
        email: true,
        createdAt: true,
        avatar: true,
      },
    });
    return users.map(this.transformUser);
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return this.transformUser(user);
  }

  async getUserByName(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    return this.transformUser(user);
  }

  private transformUser(user: any): any {
    return {
      id: user.id,
      userName: user.userName,
      OAuthName: user.OAuthName,
      email: user.email,
      createdAt: user.createdAt,
      avatar: user.avatar,
    };
  }
}
