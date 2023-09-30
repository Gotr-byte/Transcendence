import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatSharedModule } from 'src/chat/shared/chat-shared.module';

@Module({
  imports: [ChatSharedModule, PrismaModule],
  providers: [CronService],
})
export class TasksModule {}
