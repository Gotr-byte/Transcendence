import { Module } from '@nestjs/common';
import { ManagementModule } from './management/management.module';
import { AdminModule } from './admin/admin.module';
import { ChannelModule } from './channel/channel.module';
import { MessagesModule } from './messages/messages.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ManagementModule,
    AdminModule,
    ChannelModule,
    MessagesModule,
    SharedModule,
  ],
})
export class ChatModule {}
