import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ChatSharedModule } from '../shared/chat-shared.module';

@Module({
  imports: [AuthModule, ChatSharedModule],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
