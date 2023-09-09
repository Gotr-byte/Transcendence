import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { TwoFaAuthModule } from './two-fa-auth/two-fa-auth.module';
import { MatchesModule } from './matches/matches.module';
import { ChatModule } from './chat/chat.module';
import { ImgurService } from './imgur/imgur.service';
import { ImgurModule } from './imgur/imgur.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    UserModule,
    MatchesModule,
    MulterModule.register({
      dest: '../tmp',
    }),
    PrismaModule,
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    TwoFaAuthModule,
    ImgurModule,
  ],
  providers: [ImgurService],
})
export class AppModule {}
