import { Module } from '@nestjs/common';

import { AuthenticatedGuard, SessionGuard } from 'src/auth/guards/http-guards';
import { WsAuthGuard } from 'src/auth/guards/socket-guards';
import { SocketService } from 'src/socket/socket.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    AuthenticatedGuard,
    SessionGuard,
    UserService,
    WsAuthGuard,
    SocketService,
  ],
  exports: [
    AuthenticatedGuard,
    SessionGuard,
    UserService,
    WsAuthGuard,
    SocketService,
  ],
})
export class SharedModule {}
