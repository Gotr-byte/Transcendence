import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthStrategy } from './strategy/auth.strategy';
import { SessionSerializer } from './Serializer';
import { UserService } from 'src/user/user.service';
import {
  AuthenticatedGuard,
  SessionGuard,
  TwoFactorGuard,
} from './guards/Guards';

@Module({
  controllers: [AuthController],
  providers: [
    AuthStrategy,
    AuthService,
    AuthenticatedGuard,
    SessionGuard,
    TwoFactorGuard,
    SessionSerializer,
    UserService,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  exports: [AuthenticatedGuard, SessionGuard, TwoFactorGuard],
})
export class AuthModule {}
