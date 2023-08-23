import { Match, User } from '@prisma/client';
// import {
//   IsBoolean,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   IsUrl,
// } from 'class-validator';

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