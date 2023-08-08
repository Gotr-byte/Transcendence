import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('42_APP_ID'),
      clientSecret: configService.get('42_APP_SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
    });
  }

  validate() {}
}
