import {
  IsBoolean,
  IsEmail,
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

export class AddUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsBoolean()
  @IsOptional()
  is2Fa: boolean;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
