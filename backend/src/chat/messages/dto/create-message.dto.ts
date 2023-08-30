import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  content: string;
}
