import { Controller, Get, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { AuthenticatedGuard } from 'src/auth/guards/http-guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthenticatedGuard)
@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get the leaderboard' })
  async getLeaderboard() {
    const leaderboard = await this.leaderboardService.generateLeaderboard();
    return leaderboard;
  }
}
