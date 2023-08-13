import { User } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username: string;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  avatar: string;

  @IsBoolean()
  @IsOptional()
  is2Fa: boolean;
}

export class ShowUserDto {
  id: number;
  username: string;
  avatar: string;
  isOnline: boolean;

  constructor(user: User) {
    (this.id = user.id), (this.username = user.username);
    this.isOnline = user.isOnline;
    this.avatar = user.avatar;
  }

  static from(user: User): ShowUserDto {
    return new ShowUserDto(user);
  }
}
