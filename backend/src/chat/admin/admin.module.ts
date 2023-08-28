import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SharedService } from '../shared/shared.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, SharedService, UserService],
})
export class AdminModule {}
