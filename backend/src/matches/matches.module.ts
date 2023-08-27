import { Module } from '@nestjs/common';

import { matchesService } from './matches.service';
import { matchesController } from './matches.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [matchesService],
  controllers: [matchesController],
})
export class MatchesModule {}
