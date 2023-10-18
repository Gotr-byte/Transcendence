import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { Verify2FADto } from './dto/two-fa-auth.dto';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFaAuthService {
  constructor(private readonly userService: UserService) {}

  async getQrCode(user: User) {
    if (!user.is2FaActive) {
      const secret = await this.generateSecret();
      user.twoFaSecret = secret;
      await this.userService.updateUser(user, {
        twoFaSecret: secret,
        is2FaActive: true,
      });
    }
    const qrCode = await this.generateQrCode(user.twoFaSecret);
    return qrCode;
  }

  async generateSecret(): Promise<string> {
    const secret = await speakeasy.generateSecret();
    return secret.ascii;
  }

  async generateQrCode(secret): Promise<string> {
    const otpauthUrl = await speakeasy.otpauthURL({
      secret: secret,
      label: 'ft_transcendence',
      issuer: '42',
    });
    const qrCode = await qrcode.toDataURL(otpauthUrl);
    return qrCode;
  }

  async verifyToken(user: User, dto: Verify2FADto): Promise<void> {
    const secret = user.twoFaSecret;
    const verified = await speakeasy.totp.verify({
      secret: secret,
      encoding: 'ascii',
      token: dto.token,
    });
    if (verified === false) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    await this.userService.updateUser(user, {
      is2FaValid: true,
      is2FaActive: true,
    });
  }

  async deactivate2Fa(user: User): Promise<void> {
    await this.userService.updateUser(user, {
      twoFaSecret: '',
      is2FaValid: false,
      is2FaActive: false,
    });
  }
}
