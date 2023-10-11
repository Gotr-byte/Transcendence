import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WsAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const request = client.request;
    const isAuthenticated = request.isAuthenticated();
    const user = request.session.passport?.user;

    if (!isAuthenticated || (user && user.is2FaActive && !user.is2FaValid)) {
      client.emit('error', 'Not Authenticated');
      client.disconnect();
    }
    return isAuthenticated;
  }
}
