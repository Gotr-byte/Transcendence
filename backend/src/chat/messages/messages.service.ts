import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateChannelMessageDto,
  CreateUserMessageDto,
} from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatSharedService } from '../shared/chat-shared.service';
import { UserService } from 'src/user/user.service';
import { ShowMessageDto, ShowMessagesDto } from './dto/show-messages.dto';
import { UsernameId } from './types/types';
import { CustomError } from 'src/shared/shared.errors';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private readonly chatSharedService: ChatSharedService,
    private readonly userService: UserService,
  ) {}

  async createChannelMessage(
    userId: number,
    createChannelMessageDto: CreateChannelMessageDto,
  ): Promise<ShowMessageDto> {
    await this.ensureUserIsNotRestricted(
      createChannelMessageDto.channelId,
      userId,
    );
    await this.chatSharedService.ensureUserIsMember(
      createChannelMessageDto.channelId,
      userId,
    );

    const newMessage = await this.prisma.message.create({
      data: { senderId: userId, ...createChannelMessageDto },
      include: { sender: true },
    });
    return ShowMessageDto.from(newMessage);
  }

  async createUserMessage(
    senderId: number,
    createUserMessageDto: CreateUserMessageDto,
  ): Promise<ShowMessageDto> {
    if (senderId === createUserMessageDto.receiverId)
      throw new CustomError('Cannot send message  to yourself', 'SELF_MESSAGE');
    const newMessage = await this.prisma.message.create({
      data: { senderId, ...createUserMessageDto },
      include: { sender: true },
    });
    return ShowMessageDto.from(newMessage);
  }

  async getChannelMessages(
    userId: number,
    channelId: number,
  ): Promise<ShowMessagesDto> {
    await this.ensureUserIsNotRestricted(channelId, userId);
    await this.chatSharedService.ensureUserIsMember(channelId, userId);

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

  async getUserChats(userId: number): Promise<UsernameId[]> {
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
            id: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const uniqueUsernames = new Set<UsernameId>();

    messages.forEach((message) => {
      if (message.senderId !== userId) {
        uniqueUsernames.add(message.sender);
      }
      if (message.receiverId !== userId && message.receiver) {
        uniqueUsernames.add(message.receiver);
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
    if (restriction) {
      const errorMessage = `User with id '${restrictedUserId}' is ${restriction.restrictionType} on channel: (ID:${restrictedChannelId})`;
      throw new CustomError(
        errorMessage,
        `USER_${restriction.restrictionType}`,
      );
    }
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
