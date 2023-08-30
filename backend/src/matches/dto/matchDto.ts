import { Match } from '@prisma/client';


// CREATE TABLE public."Match" (
//     id integer NOT NULL,
//     started timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
//     ended timestamp(3) without time zone NOT NULL,
//     "homePlayerId" integer NOT NULL,
//     "awayPlayerId" integer NOT NULL,
//     "winnerId" integer NOT NULL,
//     "homeScore" integer NOT NULL,
//     "awayScore" integer NOT NULL
// );

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

    static toMatch(dto: CreateMatchDto) : Omit<Match, 'id'> {
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
