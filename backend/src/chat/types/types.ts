import { ShowMessageDto } from '../messages/dto';

export type ChatEvent = {
  receiverId: number;
  event: string;
  message: ShowMessageDto;
  notification: {
    type: string;
    message: string;
    userId?: string;
    channelId?: string;
    event: string;
  };
};
