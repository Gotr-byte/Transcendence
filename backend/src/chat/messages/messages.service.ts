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

  async getChannelMessages(
    userId: number,
    channelId: number,
  ): Promise<ShowMessagesDto> {
    await this.ensureUserIsNotRestricted(channelId, userId);
    await this.sharedService.ensureUserIsMember(channelId, userId);

    const messages = await this.getVisibleChannelMessages(channelId, userId);

    return messages;
  }

  async getUserMessages(
    userId: number,
    username: string,
  ): Promise<ShowMessagesDto> {
    const receiver = await this.userService.getUserByName(username);

    const messages = await this.getVisibleUserMessages(receiver.id, userId);

    return messages;
  }

  async getUserChats(userId: number): Promise<string[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            username: true,
          },
        },
        receiver: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const uniqueUsernames = new Set<string>();

    messages.forEach((message) => {
      if (message.senderId !== userId) {
        uniqueUsernames.add(message.sender.username);
      }
      if (message.receiverId !== userId && message.receiver) {
        uniqueUsernames.add(message.receiver.username);
      }
    });

    const usernamesArray = Array.from(uniqueUsernames);

    return usernamesArray;
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

  private async getVisibleChannelMessages(
    channelId: number,
    userId: number,
  ): Promise<ShowMessagesDto> {
    const channel = await this.prisma.channel.findUniqueOrThrow({
      where: {
        id: channelId,
      },
      include: {
        channelMessages: {
          where: {
            NOT: {
              sender: {
                blockedBy: {
                  some: {
                    blockingUserId: userId,
                  },
                },
              },
            },
          },
          include: {
            sender: true,
          },
        },
      },
    });

    return ShowMessagesDto.fromChannel(channel.channelMessages);
  }

  private async getVisibleUserMessages(
    receiverId: number,
    userId: number,
  ): Promise<ShowMessagesDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        sentMessages: {
          where: {
            receiverId,
          },
          include: { sender: true },
        },
        recievedMessages: {
          where: {
            senderId: receiverId,
            NOT: {
              sender: {
                blockedBy: {
                  some: {
                    blockingUserId: userId,
                  },
                },
              },
            },
          },
          include: { sender: true },
        },
      },
    });

    return ShowMessagesDto.fromUser(user.sentMessages, user.recievedMessages);
  }
}
