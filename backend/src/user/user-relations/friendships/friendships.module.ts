import { Module } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { FriendshipsService } from './friendships.service';
import { FriendshipsController } from './friendships.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [FriendshipsService, UserService],
  controllers: [FriendshipsController],
})
export class FriendshipsModule {}
