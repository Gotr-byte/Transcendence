import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FriendshipsModule } from './user-relations/friendships/friendships.module';
import { BlockingModule } from './user-relations/blocking/blocking.module';
import { CurrentUserController } from './current-user.controller';

@Module({
  imports: [FriendshipsModule, BlockingModule],
  providers: [UserService],
  controllers: [UserController, CurrentUserController],
})
export class UserModule {}
