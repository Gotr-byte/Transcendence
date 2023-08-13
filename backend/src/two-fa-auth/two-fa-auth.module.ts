import { Module } from '@nestjs/common';
import { TwoFaAuthService } from './two-fa-auth.service';
import { TwoFaAuthController } from './two-fa-auth.controller';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [TwoFaAuthService, UserService],
  controllers: [TwoFaAuthController],
})
export class TwoFaAuthModule {}
