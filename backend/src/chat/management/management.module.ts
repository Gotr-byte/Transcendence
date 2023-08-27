import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { SharedService } from '../shared/shared.service';

@Module({
  controllers: [ManagementController],
  providers: [ManagementService, SharedService],
})
export class ManagementModule {}
