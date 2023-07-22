import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.follows.findMany({ where: {} });
  }

  findPending() {
    return this.prisma.follows.findMany({where: { isPending: true }});
  }

  findFollowing(followingId: number) {
    return this.prisma.follows.findMany({where: { followingId }});
  }

  findFollower(followerId: number) {
    return this.prisma.follows.findMany({where: { followerId }});
  }

  findFriends(followerId: number, followingId: number) {
    return this.prisma.follows.findMany({where: { followerId, followingId}});
  }

  // create(createFollowDto: CreateFollowDto) {
  //   return this.prisma.follows.create({ data: createFollowDto });
  // }

  async create(createFollowDto: CreateFollowDto) {
    return this.prisma.follows.create({
      data: {
        following: {
          connect: { id: createFollowDto.followingId },
        },
        follower: {
          connect: { id: createFollowDto.followerId },
        },
        isPending: createFollowDto.isPending, // Optionally include isPending field if needed
      },
    });
  }

  // update(followerId: number, followingId: number, updateFollowsDto: UpdateFollowDto) {
  //   return this.prisma.follows.update({
  //     where: { followerId, followingId },
  //     data: updateFollowsDto,
  //   });
  // }
  // following 2 followed 3 | following 3 followed 2
}
