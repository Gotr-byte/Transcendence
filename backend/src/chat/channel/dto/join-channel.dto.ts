import { IsString, IsNotEmpty, IsOptional, NotContains } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @NotContains(' ')
  password: string;
}
