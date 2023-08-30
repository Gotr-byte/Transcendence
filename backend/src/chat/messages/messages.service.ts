import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedService } from '../shared/shared.service';
import { UserService } from 'src/user/user.service';
import { Message } from '@prisma/client';
import { ShowMessagesDto } from './dto/show-messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private readonly sharedService: SharedService,
    private readonly userService: UserService,
  ) {}

  async createChannelMessage(
    userId: number,
    channelId: number,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    await this.ensureUserIsNotRestricted(channelId, userId);
    await this.sharedService.ensureUserIsMember(channelId, userId);

    const newMessage = await this.prisma.message.create({
      data: { senderId: userId, channelId, ...createMessageDto },
    });
    return newMessage;
  }

  async createUserMessage(
    senderId: number,
    receivingName: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const receiver = await this.userService.getUserByName(receivingName);

    const newMessage = await this.prisma.message.create({
      data: { senderId, receiverId: receiver.id, ...createMessageDto },
    });
    return newMessage;
  }

  async getChannelMessages(userId: number, channelId: number) {
    await this.ensureUserIsNotRestricted(channelId, userId);
    await this.sharedService.ensureUserIsMember(channelId, userId);

    const receiving = { channelId };
    const messages = await this.getMessages(receiving, userId);
    
    return ShowMessagesDto.from(messages)
  }

  async getUserMessages(userId: number, username: string) {
    const receiver = await this.userService.getUserByName(username);  

    const receiving = { receiverId: receiver.id }
    const messages = await this.getMessages(receiving, userId)
    
    return ShowMessagesDto.from(messages)
  }
    
  private async ensureUserIsNotRestricted(
    restrictedChannelId: number,
    restrictedUserId: number,
  ) {
    const restriction = await this.prisma.channelUserRestriction.findUnique({
      where: {
        restrictedUserId_restrictedChannelId: {
          restrictedUserId,
          restrictedChannelId,
        },
      },
    });
    if (restriction)
      throw new UnauthorizedException(
        `User with id '${restrictedUserId}' is not creator of channel (ID:${restrictedChannelId})`,
      );
  }

  private async getMessages(receiving: { receiverId: number } | { channelId: number }, userId: number){
  const messages = await this.prisma.message.findMany({
    where: {
      ...receiving,
      sender: {
        NOT: {
          blockedBy: {
            some: {
              blockingUserId: userId,
            },
          },
        },
      },
    },
    include: {
      sender: true
    }
  });
  return messages;
}
}
