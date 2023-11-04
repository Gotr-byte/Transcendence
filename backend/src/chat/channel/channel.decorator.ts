import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ChannelId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    const channelId = Number(request.params.channelId);
    return channelId;
  },
);