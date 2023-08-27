import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SharedService } from '../shared/shared.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, SharedService],
})
export class AdminModule {}
