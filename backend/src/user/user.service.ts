import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		const users = this.prisma.user.findMany();
		return users
	}

	async getUser(userName: string) {
		const user = this.prisma.user.findUnique({
			where: {
				userName
			}
		})
		return user;
	}
}
