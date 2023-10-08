import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { SocketModule } from 'src/socket/socket.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [SocketModule, UserModule],
  providers: [GameGateway, GameService],
})
export class GameModule {}
