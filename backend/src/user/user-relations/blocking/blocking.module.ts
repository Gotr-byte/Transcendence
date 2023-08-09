import { Module } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { BlockingService } from './blocking.service';
import { BlockingController } from './blocking.controller';

@Module({
  providers: [BlockingService, UserService],
  controllers: [BlockingController],
})
export class BlockingModule {}
