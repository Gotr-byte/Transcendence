import { IsArray, IsNotEmpty } from "class-validator";

export class AddUsersDto {
	@IsArray()
	@IsNotEmpty()
	users: number[];
}
