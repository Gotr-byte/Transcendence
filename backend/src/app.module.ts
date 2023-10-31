import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { TwoFaAuthModule } from './two-fa-auth/two-fa-auth.module';
import { MatchesModule } from './matches/matches.module';
import { ChatModule } from './chat/chat.module';
import { ImagekitService } from './imagekit/imagekit.service';
import { ImagekitModule } from './imagekit/imagekit.module';
import { SocketModule } from './socket/socket.module';
import { TasksModule } from './tasks/tasks.module';
import { GameModule } from './game/game.module';
import { FriendshipsModule } from './user/user-relations/friendships/friendships.module';
import { BlockingModule } from './user/user-relations/blocking/blocking.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    SocketModule,
    UserModule,
    FriendshipsModule,
    BlockingModule,
    MatchesModule,
    TasksModule,
    PrismaModule,
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    TwoFaAuthModule,
    ImagekitModule,
    GameModule,
    LeaderboardModule,
  ],
  providers: [ImagekitService],
})
export class AppModule {}
