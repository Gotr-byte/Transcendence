import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class Verify2FADto {
  @IsNotEmpty()
  @IsString()
  @NotContains(" ")
  token: string;
}
