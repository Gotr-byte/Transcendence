import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TwoFaAuthService } from './two-fa-auth.service';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';
import { Verify2FADto } from './dto/two-fa-auth.dto.';

@UseGuards(AuthenticatedGuard)
@Controller('2fa')
export class TwoFaAuthController {
  constructor(private twoFaService: TwoFaAuthService) {}

  @Get('activate')
  async getQrCode(@AuthUser() user: User): Promise<string> {
    if (user.is2FaActive === true)
      throw new ConflictException('2FA is already activated');
    else {
      const qrCode = await this.twoFaService.getQrCode(user);
      return `<h2>Two-Factor Authentication Setup</h2>
		<p>Scan the QR code using a 2FA app:</p>
		<img src="${qrCode}" alt="QR Code">`;
    }
  }

  // @Get('qr')
  // async getQrCode()

  @Post('verify')
  async verifyToken(
    @AuthUser() user: User,
    @Body(new ValidationPipe()) dto: Verify2FADto,
  ): Promise<string> {
    const result = await this.twoFaService.verifyToken(user, dto);
    return `TwoFactor Authorization is ${result} `;
  }

  @Get('deactivate')
  async deavtivate2Fa(@AuthUser() user: User): Promise<string> {
    if (user.is2FaActive === false)
      throw new ConflictException('2FA is already deactivated');
    await this.twoFaService.deactivate2Fa(user);
    return '2Fa was deactivated';
  }
}
