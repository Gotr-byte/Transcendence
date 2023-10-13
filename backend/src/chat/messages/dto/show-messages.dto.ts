import { MessageWithSender } from '../types/types';

export class ShowMessageDto {
  sender: string;
  receivingUserId?: number;
  receivingChannelId?: number;
  content: string;
  createdAt: Date;

  constructor(message: MessageWithSender) {
    this.sender = message.sender.username;
    if (message.receiverId) this.receivingUserId = message.receiverId;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    else this.receivingChannelId = message.channelId!;
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
    this.messages = messages
      .sort((a, b) => a.id - b.id)
      .map((message) => ShowMessageDto.from(message));
  }

  static fromChannel(messages: MessageWithSender[]): ShowMessagesDto {
    return new ShowMessagesDto(messages);
  }

  static fromUser(
    sentMessages: MessageWithSender[],
    recievedMessages: MessageWithSender[],
  ): ShowMessagesDto {
    const allMessages = [...sentMessages, ...recievedMessages];
    return new ShowMessagesDto(allMessages);
  }
}
