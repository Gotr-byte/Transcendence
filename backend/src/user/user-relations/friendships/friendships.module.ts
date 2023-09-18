import { Module } from '@nestjs/common';

import { FriendshipsService } from './friendships.service';
import { FriendshipsController } from './friendships.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [FriendshipsService],
  controllers: [FriendshipsController],
  exports: [FriendshipsService],
})
export class FriendshipsModule {}
