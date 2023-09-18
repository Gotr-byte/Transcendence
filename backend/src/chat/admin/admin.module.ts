import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ChatSharedModule } from '../shared/chat-shared.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, ChatSharedModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
