import { Message, User } from '@prisma/client';

export type MessageWithSender = Message & {
  sender: User;
};
