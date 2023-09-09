import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FriendshipsModule } from './user-relations/friendships/friendships.module';
import { BlockingModule } from './user-relations/blocking/blocking.module';
import { CurrentUserController } from './current-user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ImgurService } from 'src/imgur/imgur.service';

@Module({
  imports: [FriendshipsModule, BlockingModule, AuthModule],
  providers: [UserService, ImgurService],
  controllers: [UserController, CurrentUserController],
})
export class UserModule {}
