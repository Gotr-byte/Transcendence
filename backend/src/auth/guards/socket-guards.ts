import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const request = client.request;
    const isAuthenticated = request.isAuthenticated();
    const user = request.session.passport?.user;

    if (!isAuthenticated || (user && user.is2FaActive && !user.is2FaValid)) {
      throw new WsException({
        error: 'Not Authenticated',
        type: 'AUTH_EXCEPTION',
      });
    }
    return isAuthenticated;
  }
}
