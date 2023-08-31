import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateMatchDto, ShowAnyMatchDto } from './dto/matchDto';

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

    // Post a match
    async createMatch( dto: CreateMatchDto): Promise<ShowAnyMatchDto> {
        const matchBody = CreateMatchDto.toMatch(dto);
        const result = await this.prisma.match.create({ data: matchBody });
        return result;
    }

    // Delete a match
    async deleteMatch(id: number): Promise<ShowAnyMatchDto> {
        const match = await this.prisma.match.delete({ where: { id } });
        return match;
    }

    // Create a match where one user disconnected
   // under construction 
    // async createDisconnectMatch(dto: CreateMatchDto): Promise<ShowAnyMatchDto> {
    //     const matchBody = CreateMatchDto.toMatch(dto);
    //     const result = await this.prisma.match.create({ data: matchBody });
    // }
    
}
