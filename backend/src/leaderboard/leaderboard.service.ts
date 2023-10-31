import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeaderboardService {
	constructor(private readonly prisma: PrismaService) {}

	async generateLeaderboard() {
		
	}
}
