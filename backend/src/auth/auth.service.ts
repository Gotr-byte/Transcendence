import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDetails } from './types/types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(details: UserDetails) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: details.email,
      },
    });
    // console.log(user);
    if (user) {
      return user;
    } else {
      console.log('user not in db, creating new user');
      const newUser = await this.prisma.user.create({
        data: {
          ...details,
        },
      });
      return newUser;
    }
  }

  async findUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }
}
