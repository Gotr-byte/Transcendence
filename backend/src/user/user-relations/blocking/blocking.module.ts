import { Module } from '@nestjs/common';

import { BlockingService } from './blocking.service';
import { BlockingController } from './blocking.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [BlockingService],
  controllers: [BlockingController],
  exports: [BlockingService],
})
export class BlockingModule {}
