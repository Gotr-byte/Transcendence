import { Module } from '@nestjs/common';
import { TwoFaAuthService } from './two-fa-auth.service';
import { TwoFaAuthController } from './two-fa-auth.controller';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [AuthModule, SharedModule],
  providers: [TwoFaAuthService, UserService],
  controllers: [TwoFaAuthController],
})
export class TwoFaAuthModule {}
