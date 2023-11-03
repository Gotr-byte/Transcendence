import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  NotContains,
} from 'class-validator';

export class AddUsersDto {
  @IsArray()
  @IsNotEmpty()
  users: number[];
}

export class ChangeUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username can only contain letters, numbers, and underscores',
  })
  username: string;

  // @IsUrl()
  // @IsNotEmpty()
  // @IsOptional()
  // @NotContains(' ')
  // avatar: string;
}

export class ChangeUserPropsDto {
  @IsBoolean()
  @IsOptional()
  is2FaActive?: boolean;

  @IsBoolean()
  @IsOptional()
  is2FaValid?: boolean;

  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @IsString()
  @IsOptional()
  @NotContains(' ')
  twoFaSecret?: string;
}

export class ShowAnyUserDto {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;
  inGame: boolean;
  achievements: string[];

  constructor(user: User) {
    (this.id = user.id), (this.username = user.username);
    this.isOnline = user.isOnline;
    this.avatar = user.avatar;
    this.inGame = user.inGame;
  }

  static from(user: User): ShowAnyUserDto {
    return new ShowAnyUserDto(user);
  }
}

export class ShowUsersDto {
  users: ShowAnyUserDto[];
  usersNo: number;

  constructor(users: User[]) {
    this.usersNo = users.length;
    this.users = users.map((user) => ShowAnyUserDto.from(user));
  }

  static from(user: User[]): ShowUsersDto {
    return new ShowUsersDto(user);
  }
}

export class ShowLoggedUserDto {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;
  inGame: boolean;
  is2FaActive: boolean;
  achievements: string[];

  constructor(user: User) {
    (this.id = user.id), (this.username = user.username);
    this.isOnline = user.isOnline;
    this.avatar = user.avatar;
    this.inGame = user.inGame;
    this.is2FaActive = user.is2FaActive;
    this.achievements = user.achievements;
  }

  static from(user: User): ShowLoggedUserDto {
    return new ShowLoggedUserDto(user);
  }
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any; // Use 'any' type for binary data
}

export class UserMatchStatsDto {
  position: number;
  matchesPlayed: number;
  matchesWon: number;
  totalPoints: number;
}

export class MatchHistoryDto {
  opponentUsername: string;
  homeScore: number;
  awayScore: number;
  result: 'Win' | 'Loss';
  date: Date;
}
