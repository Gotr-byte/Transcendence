import { Module } from '@nestjs/common';

import { AuthenticatedGuard, SessionGuard } from 'src/auth/guards/http-guards';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [AuthenticatedGuard, SessionGuard, UserService],
  exports: [AuthenticatedGuard, SessionGuard, UserService],
})
export class SharedModule {}
