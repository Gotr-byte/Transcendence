import { Module } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { FriendshipsService } from './friendships.service';
import { FriendshipsController } from './friendships.controller';

@Module({
  providers: [FriendshipsService, UserService],
  controllers: [FriendshipsController],
})
export class FriendshipsModule {}
