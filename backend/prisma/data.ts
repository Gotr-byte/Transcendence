import {
  ChannelTypes,
  ChannelMemberRoles,
  ChannelUserRestrictionTypes,
} from '@prisma/client';

export const users = [
  {
    username: 'John',
    email: 'john@john.com',
  },
  {
    username: 'Arthur',
    email: 'arthur@morgan.org',
  },
  {
    username: 'Morgana',
    email: 'morgana@persona.com',
  },
  {
    username: 'Gladys',
    email: 'gladys@wonder.com',
  },
  {
    username: 'Zardos',
    email: 'zardos@aol.com',
  },
  {
    username: 'Helena',
    email: 'helena@olymp.com',
  },
  {
    username: 'Xena',
    email: 'xena@scream.org',
  },
  {
    username: 'Anakin',
    email: 'anakin@lucasarts.com',
  },
  {
    username: 'RubberDuck',
    email: 'rubrub@rub.ru',
  },
  {
    username: 'Asterix',
    email: 'asterix@google.gae',
  },
  {
    username: 'LOGGED-IN-USER',
    email: 'iAmLoggedIn@placeholder.com',
  },
];

export const matches = [
  {
    homePlayerId: 4,
    awayPlayerId: 7,
    winnerId: 7,
    homeScore: 15,
    awayScore: 16,
  },
  {
    homePlayerId: 8,
    awayPlayerId: 3,
    winnerId: 3,
    homeScore: 0,
    awayScore: 9,
  },
  {
    homePlayerId: 4,
    awayPlayerId: 9,
    winnerId: 9,
    homeScore: 3,
    awayScore: 5,
  },
  {
    homePlayerId: 10,
    awayPlayerId: 5,
    winnerId: 10,
    homeScore: 17,
    awayScore: 2,
  },
  {
    homePlayerId: 9,
    awayPlayerId: 8,
    winnerId: 8,
    homeScore: 1,
    awayScore: 12,
  },
  {
    homePlayerId: 3,
    awayPlayerId: 1,
    winnerId: 3,
    homeScore: 11,
    awayScore: 2,
  },
  {
    homePlayerId: 9,
    awayPlayerId: 2,
    winnerId: 9,
    homeScore: 14,
    awayScore: 5,
  },
  {
    homePlayerId: 11,
    awayPlayerId: 2,
    winnerId: 9,
    homeScore: 14,
    awayScore: 5,
  },
  {
    homePlayerId: 9,
    awayPlayerId: 11,
    winnerId: 9,
    homeScore: 14,
    awayScore: 5,
  },
  {
    homePlayerId: 11,
    awayPlayerId: 2,
    winnerId: 9,
    homeScore: 14,
    awayScore: 5,
  },
];

export const blocked = [
  {
    blockedUserId: 11,
    blockingUserId: 5,
  },
  {
    blockedUserId: 2,
    blockingUserId: 11,
  },
  {
    blockedUserId: 4,
    blockingUserId: 11,
  },
  {
    blockedUserId: 5,
    blockingUserId: 8,
  },
  {
    blockedUserId: 7,
    blockingUserId: 9,
  },
];

export const friendRequests = [
  {
    senderId: 2,
    receiverId: 8,
    isAccepted: false,
  },
  {
    senderId: 6,
    receiverId: 8,
    isAccepted: true,
  },
  {
    senderId: 7,
    receiverId: 9,
    isAccepted: true,
  },
  {
    senderId: 3,
    receiverId: 4,
    isAccepted: true,
  },
  {
    senderId: 5,
    receiverId: 10,
    isAccepted: true,
  },
  {
    senderId: 3,
    receiverId: 6,
    isAccepted: false,
  },
  {
    senderId: 1,
    receiverId: 8,
    isAccepted: true,
  },
  {
    senderId: 3,
    receiverId: 7,
    isAccepted: false,
  },
  {
    senderId: 11,
    receiverId: 6,
    isAccepted: false,
  },
  {
    senderId: 1,
    receiverId: 11,
    isAccepted: false,
  },
  {
    senderId: 11,
    receiverId: 7,
    isAccepted: true,
  },
];

export const channels = [
  {
    creatorId: 5,
    title: 'Old Gods Gang',
    password: 'G0ds',
    channelType: ChannelTypes.PROTECTED,
  },
  {
    creatorId: 8,
    title: 'Icons',
    channelType: ChannelTypes.PRIVATE,
  },
  {
    creatorId: 4,
    title: 'Memes',
    channelType: ChannelTypes.PUBLIC,
  },
];

export const channelUserRestrictions = [
  {
    restrictedUserId: 6,
    restrictedChannelId: 1,
    restrictionType: ChannelUserRestrictionTypes.MUTED,
  },
  {
    restrictedUserId: 1,
    restrictedChannelId: 3,
    restrictionType: ChannelUserRestrictionTypes.BANNED,
  },
  {
    restrictedUserId: 11,
    restrictedChannelId: 1,
    restrictionType: ChannelUserRestrictionTypes.MUTED,
  },
  {
    restrictedUserId: 11,
    restrictedChannelId: 2,
    restrictionType: ChannelUserRestrictionTypes.BANNED,
  },
];

export const channelMembers = [
  { userId: 5, channelId: 1, role: ChannelMemberRoles.ADMIN },
  { userId: 6, channelId: 1, role: ChannelMemberRoles.USER },
  { userId: 3, channelId: 1, role: ChannelMemberRoles.USER },
  { userId: 7, channelId: 2, role: ChannelMemberRoles.USER },
  { userId: 8, channelId: 2, role: ChannelMemberRoles.ADMIN },
  { userId: 10, channelId: 2, role: ChannelMemberRoles.USER },
  { userId: 9, channelId: 2, role: ChannelMemberRoles.USER },
  { userId: 1, channelId: 3, role: ChannelMemberRoles.USER },
  { userId: 2, channelId: 3, role: ChannelMemberRoles.USER },
  { userId: 7, channelId: 3, role: ChannelMemberRoles.USER },
  { userId: 10, channelId: 3, role: ChannelMemberRoles.USER },
  { userId: 7, channelId: 1, role: ChannelMemberRoles.USER },
  { userId: 4, channelId: 3, role: ChannelMemberRoles.ADMIN },
  { userId: 3, channelId: 3, role: ChannelMemberRoles.ADMIN },
  { userId: 11, channelId: 1, role: ChannelMemberRoles.USER },
  { userId: 11, channelId: 3, role: ChannelMemberRoles.ADMIN },
];

export const messages = [
  { senderId: 5, channelId: 1, content: 'Hey everyone, how are you doing?' },
  { senderId: 6, channelId: 1, content: 'Did anyone said chips?' },
  { senderId: 3, channelId: 1, content: 'Dont be a funny' },
  { senderId: 7, channelId: 2, content: 'Heeey, the best channel on earth just opened' },
  { senderId: 8, channelId: 2, content: 'Yoyoyooo wahts poppin?' },
  { senderId: 10, channelId: 2, content: 'ROFL' },
  { senderId: 9, channelId: 2, content: 'Helloooo party peeps' },
  { senderId: 1, channelId: 3, content: 'Good evening fellow pong players' },
  { senderId: 2, channelId: 3, content: 'Who is up for a match??' },
  { senderId: 7, channelId: 3, content: 'Lets get this rockin' },
  { senderId: 10, channelId: 3, content: 'Nice weather today, right=?!?!' },
  { senderId: 7, channelId: 1, content: 'Yeeah!' },
  { senderId: 4, channelId: 3, content: 'best channel in town' },
  { senderId: 3, channelId: 3, content: 'Crazy pong game' },
  { senderId: 11, channelId: 1, content: 'GG' },
  { senderId: 11, channelId: 3, content: 'Bye' },
];
