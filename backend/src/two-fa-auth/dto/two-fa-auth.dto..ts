import { IsNotEmpty, IsString } from 'class-validator';

export class Verify2FADto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
