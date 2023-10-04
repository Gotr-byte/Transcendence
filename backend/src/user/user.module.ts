import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CurrentUserController } from './current-user.controller';
import { ImagekitModule } from 'src/imagekit/imagekit.module';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [ImagekitModule, SharedModule],
  providers: [UserService],
  controllers: [UserController, CurrentUserController],
  exports: [UserService],
})
export class UserModule {}
