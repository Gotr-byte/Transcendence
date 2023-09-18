import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateChannelMessageDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  content: string;

  @IsNumber()
  @IsPositive()
  channelId: number;
}

export class CreateUserMessageDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  content: string;

  @IsNumber()
  @IsPositive()
  receiverId: number;
}
