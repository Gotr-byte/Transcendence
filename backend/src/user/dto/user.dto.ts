import { User } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class ChangeUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username: string;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  avatar: string;
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
  twoFaSecret?: string;
}

export class ShowAnyUserDto {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;

  constructor(user: User) {
    (this.id = user.id), (this.username = user.username);
    this.isOnline = user.isOnline;
    this.avatar = user.avatar;
  }

  static from(user: User): ShowAnyUserDto {
    return new ShowAnyUserDto(user);
  }
}

export class ShowLoggedUserDto {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;
  is2FaActive: boolean;

  constructor(user: User) {
    (this.id = user.id), (this.username = user.username);
    this.isOnline = user.isOnline;
    this.avatar = user.avatar;
    this.is2FaActive = user.is2FaActive;
  }

  static from(user: User): ShowLoggedUserDto {
    return new ShowLoggedUserDto(user);
  }
}
