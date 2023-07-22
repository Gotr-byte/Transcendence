import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get()
  findAll() {
    return this.followsService.findAll();
  }

  @Get('pending')
  findPending() {
    return this.followsService.findPending();
  }

  @Get('following/:followingId')
  findFollowing(@Param('followingId') followingId: string) {
    return this.followsService.findFollowing(+followingId);
  }

  @Get('followers/:followerId')
  findFollower(@Param('followerId') followerId: string) {
    return this.followsService.findFollower(+followerId);
  }

  @Get('friends/:followerId&:followingId')
  findFriends(@Param('followerId') followerId: string, @Param('followingId') followingId: string) {
    return this.followsService.findFriends(+followerId, +followingId);
  }

  @Post()
  create(@Body() createFollowDto: CreateFollowDto) {
  return this.followsService.create(createFollowDto);
  }

  //   @Patch('pending/:followerId&:followingId')
  //   update(@Param('followerId') followerId: string, @Param('followingId') followingId: string, @Body() updateFollowsDto: UpdateFollowsDto) {
  //   return this.followsService.update(+followerId, +followingId, updateFollowsDto);
  // }
}
