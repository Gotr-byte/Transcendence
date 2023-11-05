import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import {
  ChangeUserDto,
  ChangeUserPropsDto,
  MatchHistoryDto,
  ShowLoggedUserDto,
  ShowUsersDto,
  UserMatchStatsDto,
} from './dto';
import { UserDetails } from './types';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

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
    this.updateUserViaId(user.id, dto);
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { ...dto },
    });
    return updatedUser;
  }

  async updateUserViaId(
    userId: number,
    dto: ChangeUserDto | ChangeUserPropsDto,
  ): Promise<ShowLoggedUserDto> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
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
    const leaderboard = await this.leaderboardService.generateLeaderboard();
    const leaderboardEntry = leaderboard.find(
      (entry) => entry.username === username,
    );
    if (!leaderboardEntry)
      throw new InternalServerErrorException('Username not on leaderboard');
    const userStats = {
      position: leaderboardEntry.position,
      matchesPlayed: leaderboardEntry.losses + leaderboardEntry.wins,
      matchesWon: leaderboardEntry.wins,
      totalPoints: leaderboardEntry.points,
    };
    return userStats;
  }

  async getLastFiveMatches(username: string): Promise<MatchHistoryDto[]> {
    const user = await this.getUserByName(username);
    // Fetch the last 5 matches where the user was either the home or away player.
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ homePlayerId: user.id }, { awayPlayerId: user.id }],
      },
      take: 5,
      orderBy: {
        ended: 'desc',
      },
      include: {
        homePlayer: true,
        awayPlayer: true,
      },
    });

    return matches.map((match) => {
      const isHomePlayer = match.homePlayerId === user.id;
      const opponent = isHomePlayer ? match.awayPlayer : match.homePlayer;
      const result = match.winnerId === user.id ? 'Win' : 'Loss';

      return {
        opponentUsername: opponent.username,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        result,
        date: match.ended,
      };
    });
  }
}
