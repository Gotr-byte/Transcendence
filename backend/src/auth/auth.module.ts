import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthStrategy } from './strategy/auth.strategy';
import { SessionSerializer } from './serialize';
import { AuthenticatedGuard, SessionGuard } from './guards/http-guards';
import { WsAuthGuard } from './guards/socket-guards';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [
    AuthStrategy,
    AuthenticatedGuard,
    SessionGuard,
    WsAuthGuard,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  exports: [AuthenticatedGuard, SessionGuard, WsAuthGuard],
})
export class AuthModule {}
