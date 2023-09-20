import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ChatSharedModule } from '../shared/chat-shared.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, MessagesModule, ChatSharedModule, UserModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
