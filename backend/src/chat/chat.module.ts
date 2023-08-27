import { Module } from '@nestjs/common';
import { ManagementModule } from './management/management.module';
import { AdminModule } from './admin/admin.module';
import { ChannelUserModule } from './channel-user/channel-user.module';
import { MessagesModule } from './messages/messages.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ManagementModule,
    AdminModule,
    ChannelUserModule,
    MessagesModule,
    SharedModule,
  ],
})
export class ChatModule {}
