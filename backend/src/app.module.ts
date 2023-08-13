import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { TwoFaAuthModule } from './two-fa-auth/two-fa-auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    TwoFaAuthModule,
  ],
})
export class AppModule {}
