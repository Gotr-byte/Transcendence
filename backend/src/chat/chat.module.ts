import { Module } from '@nestjs/common';
import { ManagementModule } from './management/management.module';
import { AdminModule } from './admin/admin.module';
import { ChannelModule } from './channel/channel.module';
import { MessagesModule } from './messages/messages.module';
import { ChatSharedModule } from './shared/chat-shared.module';
import { ChatGateway } from './chat.gateway';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    ManagementModule,
    AdminModule,
    ChannelModule,
    MessagesModule,
    ChatSharedModule,
    SocketModule,
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
