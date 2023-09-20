import { Module } from '@nestjs/common';

import { AuthenticatedGuard, SessionGuard } from 'src/auth/guards/http-guards';
import { SocketSessionGuard } from 'src/auth/guards/socket-guards';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    AuthenticatedGuard,
    SessionGuard,
    UserService,
    SocketSessionGuard,
  ],
  exports: [AuthenticatedGuard, SessionGuard, UserService, SocketSessionGuard],
})
export class SharedModule {}
