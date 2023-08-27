import { Module } from '@nestjs/common';
import { ChannelUserService } from './channel-user.service';
import { ChannelUserController } from './channel-user.controller';
import { SharedService } from '../shared/shared.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ChannelUserController],
  providers: [ChannelUserService, SharedService],
})
export class ChannelUserModule {}
