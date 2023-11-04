import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SocketService {
  private userSocketMap = new Map<string, number>();

  constructor(private readonly userService: UserService) {}

  async registerOnlineUser(userId: number, socketId: string): Promise<void> {
    this.userSocketMap.set(socketId, userId);
    const user = await this.userService.getUserById(+userId);
    await this.userService.updateUser(user, { isOnline: true });
    console.log(this.userSocketMap); //debug
  }

  async disconnectUser(socketId: string): Promise<void> {
    const userId = this.getUserId(socketId);
    if (!userId) {
      return;
    }
    const user = await this.userService.getUserById(userId);
    await this.userService.updateUser(user, { isOnline: false });
    this.userSocketMap.delete(socketId);
    console.log(this.userSocketMap); // debug
  }

  isValidUser(client: Socket): User | null {
    const user = (client.request as any)?.session?.passport?.user;

    if (!user) {
      return null;
    }

    const { is2FaActive, is2FaValid } = user;

    if (!is2FaActive) {
      return user;
    }

    if (is2FaActive && is2FaValid) {
      return user;
    }

    if (is2FaActive && !is2FaValid) {
      return null;
    }
    throw new WsException('Internal validation socket error');
  }

  getUserId(socketId: string): number | null {
    const userId = this.userSocketMap.get(socketId);
    if (!userId) return null;
    return userId;
  }

  getSocketIds(userId: number): string[] {
    const socketIds: string[] = [];

    for (const [key, value] of this.userSocketMap.entries()) {
      if (value === userId) {
        socketIds.push(key);
      }
    }
    return socketIds;
  }

  getSocket
}
