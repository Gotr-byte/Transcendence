import { Module } from '@nestjs/common';
import { ChannelController } from './channels.controller';
import { ChannelService } from './channels.service';
import { AuthModule } from 'src/auth/auth.module';
import { ManagementModule } from './management/management.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { MessagesModule } from './messages/messages.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [AuthModule, ManagementModule, AdminModule, UserModule, MessagesModule, SharedModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChatModule {}
