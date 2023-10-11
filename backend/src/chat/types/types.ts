export type ChatEvent = {
  receiverId: number;
  event: string;
  message: {
    id: number;
    senderId: number;
    receiverId: number | null;
    channelId: number | null;
    content: string;
    createdAt: Date;
  };
  notification: {
    type: string;
    message: string;
    userId?: string;
    channelId?: string;
    event: string;
  };
};
