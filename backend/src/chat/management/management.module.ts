import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { SharedService } from '../shared/shared.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ManagementController],
  providers: [ManagementService, SharedService],
})
export class ManagementModule {}
