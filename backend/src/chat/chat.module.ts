import { Module } from '@nestjs/common';
import { ManagementModule } from './management/management.module';
import { AdminModule } from './admin/admin.module';
import { ChannelModule } from './channel/channel.module';
import { MessagesModule } from './messages/messages.module';
import { ChatSharedModule } from './shared/chat-shared.module';
// import { ChatGateway } from './chat.gateway';
import { SocketModule } from 'src/socket/socket.module';
import { BlockingModule } from 'src/user/user-relations/blocking/blocking.module';

@Module({
  imports: [
    ManagementModule,
    AdminModule,
    ChannelModule,
    MessagesModule,
    ChatSharedModule,
    SocketModule,
    BlockingModule,
  ],
  // providers: [ChatGateway],
})
export class ChatModule {}
