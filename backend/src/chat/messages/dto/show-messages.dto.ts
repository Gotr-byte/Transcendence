import { ChannelMemberRoles, Message } from '@prisma/client';
import { MessageWithSender } from '../types/types';

export class ShowMessageDto {
  sender: string;
  content: string;
  createdAt: Date;

  constructor(message: MessageWithSender) {
    this.sender = message.sender.username;
    this.content = message.content;
    this.createdAt = message.createdAt;
  }

  static from(message: MessageWithSender): ShowMessageDto {
    return new ShowMessageDto(message);
  }
}

export class ShowMessagesDto {
  messages: ShowMessageDto[];

  constructor(messages: MessageWithSender[]) {
    this.messages = messages.map((message) => ShowMessageDto.from(message));
  }

  static from(messages: MessageWithSender[]): ShowMessagesDto {
    return new ShowMessagesDto(messages);
  }
}
