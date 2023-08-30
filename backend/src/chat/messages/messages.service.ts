import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedService } from '../shared/shared.service';
import { UserService } from 'src/user/user.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private readonly sharedService: SharedService,
    private readonly userService: UserService,
  ) {}

  async createChannelMessage(
    channelId: number,
    userId: number,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    await this.ensureUserIsNotRestricted(channelId, userId);
    await this.sharedService.ensureUserIsMember(channelId, userId);

    const newMessage = await this.prisma.message.create({
      data: { senderId: userId, channelId, ...createMessageDto}
    })
    return newMessage;
  }

  async createUserMessage(
    senderId: number,
    receivingName: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const receiver = await this.userService.getUserByName(receivingName);

    const newMessage = await this.prisma.message.create({
      data: { senderId, receiverId: receiver.id, ...createMessageDto}
    })
    return newMessage;
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
}
