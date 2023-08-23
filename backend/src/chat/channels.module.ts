import { Module } from '@nestjs/common';
import { ChannelController } from './channels.controller';
import { ChannelService } from './channels.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChatModule {}
