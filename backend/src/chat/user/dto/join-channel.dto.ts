import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class JoinChannelDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	password: string;
  }