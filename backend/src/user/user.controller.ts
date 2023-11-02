import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  MatchHistoryDto,
  ShowAnyUserDto,
  ShowLoggedUserDto,
  ShowUsersDto,
  UserMatchStatsDto,
} from './dto';
import { AuthenticatedGuard } from 'src/auth/guards/http-guards';
import { ImagekitService } from 'src/imagekit/imagekit.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthenticatedGuard)
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAll(): Promise<ShowUsersDto> {
    const users = await this.userService.getAll();
    return users;
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get user by username' })
  async getUserByName(
    @Param('username') username: string,
  ): Promise<ShowLoggedUserDto | ShowAnyUserDto> {
    const user = await this.userService.getUserByName(username);
    return user.username === username
      ? ShowLoggedUserDto.from(user)
      : ShowAnyUserDto.from(user);
  }

  @Get(':username/achievements')
  @ApiOperation({ summary: "Get user's achievements" })
  async getUserAchievements(
    @Param('username') username: string,
  ): Promise<string[]> {
    const user = await this.userService.getUserByName(username);
    return user.achievements;
  }

  @Get(':username/matches/stats')
  @ApiOperation({ summary: "Get user's match stats" })
  async getUserMatchStats(
    @Param('username') username: string,
  ): Promise<UserMatchStatsDto> {
    const stats = await this.userService.getUserMatchStats(username);
    return stats;
  }

  @Get(':username/matches/history')
  @ApiOperation({ summary: 'Get last 5 played matches' })
  async getLastFiveMatches(
    @Param('username') username: string,
  ): Promise<MatchHistoryDto[]> {
    const matchHistory = this.userService.getLastFiveMatches(username);
    return matchHistory;
  }
}
