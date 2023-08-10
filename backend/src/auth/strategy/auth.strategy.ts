import { ConfigService } from '@nestjs/config';
import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';

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

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = this.authService.validateUser({
      username: profile.username,
      email: profile.emails[0].value,
    });
    return user || null;
  }
}
