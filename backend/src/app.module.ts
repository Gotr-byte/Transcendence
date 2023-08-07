import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ControllerService } from './controller/controller.service';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  providers: [ControllerService],
})
export class AppModule {}
