import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ManagementModule } from './management/management.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { MessagesModule } from './messages/messages.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ManagementModule,
    AdminModule,
    UserModule,
    MessagesModule,
    SharedModule,
  ],
})
export class ChatModule {}
