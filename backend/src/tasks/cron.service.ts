import { Injectable, OnModuleInit } from '@nestjs/common';
import cron from 'node-cron';
import { ChatSharedService } from 'src/chat/shared/chat-shared.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private readonly chatSharedService: ChatSharedService,
  ) {}

  private async checkOnlineUsersAndRemoveRestrictions() {
    const onlineUsers = await this.prisma.user.findMany({
      where: {
        isOnline: true, // Adjust based on your implementation.
      },
    });

    for (const user of onlineUsers) {
      await this.chatSharedService.removeExpiredChannelRestrictions(user.id);
    }
  }

  private async startCronJobs() {
    cron.schedule('*/10 * * * * *', async () => {
      await this.checkOnlineUsersAndRemoveRestrictions();
    });
  }

  async onModuleInit() {
    this.startCronJobs();
  }
}
