import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { ShowAnyMatchDto } from './dto/matchDto';

@Injectable()
export class matchesService {
  constructor(private prisma: PrismaService) {}

  // Get a list of all matches
  async getAll(): Promise<ShowAnyMatchDto[]> {
    const matches = await this.prisma.match.findMany({});
    const userDtos = matches.map((match) => ShowAnyMatchDto.from(match));
    return userDtos;
  }

  // Find matches by player
  async getAllForUser(user: User): Promise<ShowAnyMatchDto[]> {
    const awayMatches = await this.prisma.match.findMany({
      where: { awayPlayerId: user.id },
    });
    const homeMatches = await this.prisma.match.findMany({
      where: { homePlayerId: user.id },
    });
    const matches = awayMatches.concat(homeMatches);
    const userDtos = matches.map((match) => ShowAnyMatchDto.from(match));
    return userDtos;
  }
}
