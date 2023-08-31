import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SharedService } from '../shared/shared.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [AuthModule],
  controllers: [MessagesController],
  providers: [MessagesService, SharedService, UserService],
})
export class MessagesModule {}
