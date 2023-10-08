import { Module } from '@nestjs/common';

import { FriendshipsService } from './friendships.service';
import { FriendshipsController } from './friendships.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [FriendshipsService],
  controllers: [FriendshipsController],
  exports: [FriendshipsService],
})
export class FriendshipsModule {}
