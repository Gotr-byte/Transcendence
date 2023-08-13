import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDetails } from 'src/user/types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // Validates user details and fetches or creates user in the database
  async validateUser(details: UserDetails): Promise<User> {
    // Check if user exists based on email
    const user = await this.userService.getUserByEmail(details.email);

    // If user exists, return the user
    if (user) {
      return user;
    } else {
      // Create a new user if not found
      console.log('user not in db, creating new user');
      const newUser = await this.userService.createUser(details);
      return newUser;
    }
  }

  // Deletes the current session
  async deleteSession(sessionId: string): Promise<void> {
    await this.prisma.session.delete({
      where: { sid: sessionId },
    });
  }
}
