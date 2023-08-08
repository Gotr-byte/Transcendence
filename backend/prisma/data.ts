import {
  PrismaClient,
  ChannelTypes,
  ChannelMemberRoles,
  ChannelUserRestrictionTypes,
} from '@prisma/client';

export const users = [
  {
    username: 'John',
    OAuthName: 'sdfjalk',
    email: 'john@john.com',
  },
  {
    username: 'Arthur',
    OAuthName: 'sfsh',
    email: 'arthur@morgan.org',
  },
  {
    username: 'Morgana',
    OAuthName: 'hgflkj',
    email: 'morgana@persone.com',
  },
  {
    username: 'Gladys',
    OAuthName: 'dghhg',
    email: 'gladys@wonder.com',
  },
  {
    username: 'Zardos',
    OAuthName: 'gjfjfjfz',
    email: 'zardos@aol.com',
  },
  {
    username: 'Helena',
    OAuthName: 'drhdthth',
    email: 'helena@olymp.com',
  },
  {
    username: 'Xena',
    OAuthName: 'fjtdrtdjzf',
    email: 'xena@scream.org',
  },
  {
    username: 'Anakin',
    OAuthName: 'thddthtj',
    email: 'anakin@lucasarts.com',
  },
  {
    username: 'RubberDuck',
    OAuthName: 'fghzjfjnfg',
    email: 'rubrub@rub.ru',
  },
  {
    username: 'Asterix',
    OAuthName: 'tjfjdhdh',
    email: 'asterix@google.gae',
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
];
