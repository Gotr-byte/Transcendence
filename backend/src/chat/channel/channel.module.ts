import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { SharedService } from '../shared/shared.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ChannelController],
  providers: [ChannelService, SharedService],
})
export class ChannelModule {}
