import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Customizes canActivate method to log in user after successful 42 authentication
export class AuthGuard42 extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();

    // Log in user after successful 42 authentication
    await super.logIn(request);
    return activate;
  }
}

@Injectable()
export class SessionGuard implements CanActivate {
  // Checks if the user is authenticated
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.session.passport?.user;

    if (!user) {
      throw new UnauthorizedException('Not logged in');
    }

    return request.isAuthenticated();
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly sessionGuard: SessionGuard) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSessionValid = await this.sessionGuard.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.session.passport?.user;

    console.log(user);
    if (user && user.is2FaActive && !user.is2FaValid) {
      throw new UnauthorizedException(`${user.username} 2fa is not validated`);
    }
    return isSessionValid;
  }
}
