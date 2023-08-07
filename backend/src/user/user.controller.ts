import { Controller, Get, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('all')
	async getAll() {
		try {
			const users = await this.userService.getAll();
			return users
		}
		catch (error) {
			throw new InternalServerErrorException('An error occurred while fetching all users');
		}
	}

	@Get(':username')
	async getUser(@Param('username') username: string) {
		try {
			const user = await this.userService.getUser(username);
			if (!user)
				throw new NotFoundException('${username} not found');
			return user;
		}
		catch (error) {
			throw new InternalServerErrorException('An error occurred while fetching user data');
		}
	}
}
