import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [SocketModule],
  providers: [GameGateway, GameService],
})
export class GameModule {}
