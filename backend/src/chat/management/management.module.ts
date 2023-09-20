import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ChatSharedModule } from '../shared/chat-shared.module';

@Module({
  imports: [AuthModule, ChatSharedModule],
  controllers: [ManagementController],
  providers: [ManagementService],
  exports: [ManagementService],
})
export class ManagementModule {}
