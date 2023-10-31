import { Controller, Get, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { AuthenticatedGuard } from 'src/auth/guards/http-guards';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(AuthenticatedGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get the leaderboard' })
  async getLeaderboard() {
    await this.leaderboardService.generateLeaderboard();
  }
}
