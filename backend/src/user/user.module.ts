import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FriendshipsModule } from './user-relations/friendships/friendships.module';
import { BlockingModule } from './user-relations/blocking/blocking.module';
import { CurrentUserController } from './current-user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [FriendshipsModule, BlockingModule, AuthModule],
  providers: [UserService],
  controllers: [UserController, CurrentUserController],
})
export class UserModule {}
