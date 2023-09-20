import { Message, User } from '@prisma/client';

export type MessageWithSender = Message & {
  sender: User;
};

export type UsernameId = {
  username: string;
  id: number;
};
