import { Module } from '@nestjs/common';
import { ImagekitService } from './imagekit.service';

@Module({
  providers: [ImagekitService],
  exports: [ImagekitService],
})
export class ImagekitModule {}
