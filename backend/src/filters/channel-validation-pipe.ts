import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ChannelIdValidationPipe implements PipeTransform {
  transform(value: number): number {
    if (value < 1 || value > 999) {
      throw new BadRequestException('Channel ID must be between 1 and 999.');
    }
    return value;
  }
}