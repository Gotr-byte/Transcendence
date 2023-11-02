import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import {
  ChangeUserDto,
  ChangeUserPropsDto,
  ShowLoggedUserDto,
  ShowUsersDto,
  UserMatchStatsDto,
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

  async getUserAchievements(id: number): Promise<string[]> {
    const user = await this.getUserById(id);
    return user.achievements;
  }

  async addAchievement(userId: number, achievement: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { achievements: { push: achievement } },
    });
  }

  async getUserMatchStats(username: string): Promise<UserMatchStatsDto> {
    const user = await this.getUserByName(username);
    // 1. Matches played
    const matchesPlayed = await this.prisma.match.count({
      where: {
        OR: [{ homePlayerId: user.id }, { awayPlayerId: user.id }]
      }
    });
  
    // 2. Matches won
    const matchesWon = await this.prisma.match.count({
      where: { winnerId: user.id }
    });
  
    // 3. Total points (based on your earlier points system)
    const homeMatches = await this.prisma.match.findMany({
      where: { homePlayerId: user.id }
    });
    const awayMatches = await this.prisma.match.findMany({
      where: { awayPlayerId: user.id }
    });
  
    const pointsFromGoals = homeMatches.reduce((acc, match) => acc + match.homeScore, 0) * 5 +
                            awayMatches.reduce((acc, match) => acc + match.awayScore, 0) * 5;
    
    const pointsFromWins = matchesWon * 100;
    const totalPoints = pointsFromGoals + pointsFromWins;
  
    return {
      matchesPlayed,
      matchesWon,
      totalPoints
    };
  }
}
