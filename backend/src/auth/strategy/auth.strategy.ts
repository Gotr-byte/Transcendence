import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';
import { UserDetails } from 'src/user/types';

export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.APP_ID_42,
      clientSecret: process.env.APP_SECRET_42,
      callbackURL: process.env.CALLBACK_URL,
    });
  }

  // Validates and returns user information after 42 authentication
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    // Validate user details and fetch or create user in database
    const user = this.authService.validateUser({
      username: profile.username,
      email: profile.emails[0].value,
    });
    return user || null;
  }
}
