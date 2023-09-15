import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  // Serialize the user into the session.
  // eslint-disable-next-line @typescript-eslint/ban-types
  serializeUser(user: User, done: Function): void {
    // console.log('serialize user');
    done(null, user);
  }

  // Deserialize the user from the session.
  // eslint-disable-next-line @typescript-eslint/ban-types
  deserializeUser(payload: User, done: Function): void {
    // Retrieve the user based on the user ID.
    const user = this.userService.getUserByEmail(payload.email);
    // console.log('deserialize user');
    // console.log(user);
    return user ? done(null, user) : done(null, null);
  }
}
