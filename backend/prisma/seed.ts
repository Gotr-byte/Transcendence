import { PrismaClient } from '@prisma/client';
import {
  users,
  friendRequests,
  matches,
  channels,
  channelMembers,
  channelUserRestrictions,
} from './data';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.createMany({
      data: users,
    });

    await prisma.friendRequest.createMany({
      data: friendRequests,
    });

    await prisma.match.createMany({
      data: matches,
    });

    await prisma.channel.createMany({
      data: channels,
    });

    await prisma.channelUserRestriction.createMany({
      data: channelUserRestrictions,
    });

    await prisma.channelMember.createMany({
      data: channelMembers,
    });

    console.log('Seed completed.');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
