import { IsNotEmpty, IsString } from 'class-validator';

export class InviteUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
