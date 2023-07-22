// prisma/seed.ts

import { PrismaClient} from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {},
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
    },
  });
  //this is for test
  // const post3 = await prisma.user.upsert(
    try {
      // Create some users
      const user1 = await prisma.user.create({ data: { name: 'User1' } });
      const user2 = await prisma.user.create({ data: { name: 'User2' } });
      const user3 = await prisma.user.create({ data: { name: 'User3' } });
  
      // Create follow relationships with different isPending values
      // const follow1 = await prisma.follows.create({
      //   data: { followerId: user1.id, followingId: user2.id, isPending: false },
      // });
  
      // const follow2 = await prisma.follows.create({
      //   data: { followerId: user2.id, followingId: user1.id, isPending: true },
      // });
  
      // const follow3 = await prisma.follows.create({
      //   data: { followerId: user1.id, followingId: user3.id, isPending: false },
      // });
  
      // // Query the users with their followers and following relationships
      // const usersWithFollowersAndFollowing = await prisma.user.findMany({
      //   include: {
      //     followedBy: { include: { follower: true } },
      //     following: { include: { following: true } },
      //   },
      // });
  
      // console.log('Users with followers and following:');
      // console.log(JSON.stringify(usersWithFollowersAndFollowing, null, 2));
    } catch (error) {
      console.error('Error generating dummy data:', error);
    } finally {
      await prisma.$disconnect();
    }
  
  // );
  //this is for the test
  console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });