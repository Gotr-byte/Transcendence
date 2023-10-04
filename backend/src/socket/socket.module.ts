import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
