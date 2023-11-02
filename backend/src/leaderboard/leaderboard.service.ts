import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaderboardEntryDto } from './dto';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async generateLeaderboard(): Promise<LeaderboardEntryDto[]> {
    // Step 1: Fetch all users and initialize their points to zero.
    const users = await this.prisma.user.findMany();
    const leaderboardMap: Record<number, LeaderboardEntryDto> = {};

    users.forEach((user) => {
      leaderboardMap[user.id] = {
        position: 0,
        username: user.username,
        wins: 0,
        losses: 0,
        points: 0,
      };
    });

    // Step 2: Calculate the points for each match played.
    const matches = await this.prisma.match.findMany();

    matches.forEach((match) => {
      // Add points for goals
      leaderboardMap[match.homePlayerId].points += match.homeScore * 5;
      leaderboardMap[match.awayPlayerId].points += match.awayScore * 5;

      // Add win points
      if (match.winnerId === match.homePlayerId) {
        leaderboardMap[match.homePlayerId].points += 100;
        leaderboardMap[match.homePlayerId].wins++;
        leaderboardMap[match.awayPlayerId].losses++;
      } else {
        leaderboardMap[match.awayPlayerId].points += 100;
        leaderboardMap[match.awayPlayerId].wins++;
        leaderboardMap[match.homePlayerId].losses++;
      }
    });

    // Step 3: Sort by points
    const leaderboardArray = Object.values(leaderboardMap).sort(
      (a, b) => b.points - a.points,
    );

    // Step 4: Add positions
    leaderboardArray.forEach((entry, index) => {
      entry.position = index + 1;
    });

    return leaderboardArray;
  }
}
