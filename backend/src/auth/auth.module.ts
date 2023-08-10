import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthStrategy } from './strategy/auth.strategy';
import { SessionSerializer } from './Serializer';

@Module({
  controllers: [AuthController],
  providers: [
    AuthStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
