export type UserDetails = {
  username: string;
  email: string;
};

export type FriendRequestWhereInput = {
  isAccepted: boolean;
  senderId?: number;
  receiverId?: number;
};

export type BlockedWhereInput = {
  blockedUserId?: number;
  blockingUserId?: number;
};
