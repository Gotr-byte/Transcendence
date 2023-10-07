import { Module } from '@nestjs/common';
import { ChatSharedService } from './chat-shared.service';

@Module({
  providers: [ChatSharedService],
  exports: [ChatSharedService],
})
export class ChatSharedModule {}
