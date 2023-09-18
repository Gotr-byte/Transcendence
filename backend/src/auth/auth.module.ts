import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthStrategy } from './strategy/auth.strategy';
import { SessionSerializer } from './Serializer';
import { AuthenticatedGuard, SessionGuard } from './guards/http-guards';
import { UserModule } from 'src/user/user.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [
    AuthStrategy,
    AuthenticatedGuard,
    SessionGuard,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  exports: [AuthenticatedGuard, SessionGuard],
})
export class AuthModule {}
