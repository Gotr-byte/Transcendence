import { Match } from '@prisma/client';

export class ShowAnyMatchDto {
  id: number;
  homePlayerId: number;
  awayPlayerId: number;
  winnerId: number;

  constructor(match: Match) {
    this.id = match.id;
    this.homePlayerId = match.homePlayerId;
    this.awayPlayerId = match.awayPlayerId;
    this.winnerId = match.winnerId;
  }

  static from(match: Match): ShowAnyMatchDto {
    return new ShowAnyMatchDto(match);
  }
}

export class CreateMatchDto {
  started: Date;
  ended: Date;
  homePlayerId: number;
  awayPlayerId: number;
  winnerId: number;
  homeScore: number;
  awayScore: number;

  static toMatch(dto: CreateMatchDto): Omit<Match, 'id'> {
    return {
      started: dto.started,
      ended: dto.ended,
      homePlayerId: dto.homePlayerId,
      awayPlayerId: dto.awayPlayerId,
      winnerId: dto.winnerId,
      homeScore: dto.homeScore,
      awayScore: dto.awayScore,
    };
  }
}
