import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// This decorator is designed to extract the authenticated user from the request context.
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
