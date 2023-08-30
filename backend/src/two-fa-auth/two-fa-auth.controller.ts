import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TwoFaAuthService } from './two-fa-auth.service';
import { AuthenticatedGuard, SessionGuard } from 'src/auth/guards/Guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';
import { Verify2FADto } from './dto/two-fa-auth.dto.';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('2f-auth')
@Controller('2fa')
export class TwoFaAuthController {
  constructor(private readonly twoFaService: TwoFaAuthService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('activate')
  async getQrCode(@AuthUser() user: User): Promise<string> {
    const qrCode = await this.twoFaService.getQrCode(user);
    return `<h2>Two-Factor Authentication Setup</h2>
		<p>Scan the QR code using a 2FA app:</p>
		<img src="${qrCode}" alt="QR Code">`;
  }

  @UseGuards(SessionGuard)
  @Post('verify')
  async verifyToken(
    @AuthUser() user: User,
    @Body() dto: Verify2FADto,
    @Res() response: Response,
  ): Promise<void> {
    if (user) {
      if (user.is2FaValid)
        throw new BadRequestException(`${user.username} is already verified`);
      await this.twoFaService.verifyToken(user, dto);
    }
    return response.redirect('/auth/status');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('deactivate')
  async deavtivate2Fa(@AuthUser() user: User): Promise<string> {
    if (user.is2FaActive === false)
      throw new ConflictException('2FA is already deactivated');
    await this.twoFaService.deactivate2Fa(user);
    return '2Fa was deactivated';
  }
}
