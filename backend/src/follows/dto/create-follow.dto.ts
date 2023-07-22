// export class CreateFollowDto {}

import { ApiProperty } from '@nestjs/swagger';

export class CreateFollowDto {
  @ApiProperty()
  followingId: number;

  @ApiProperty()
  followerId: number;

  @ApiProperty({ required: true, default: true })
  isPending?: boolean = true;

//   @ApiProperty({ required: false, default: false })
//   published?: boolean = false;
}