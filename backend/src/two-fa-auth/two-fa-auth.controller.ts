import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TwoFaAuthService } from './two-fa-auth.service';
import { AuthenticatedGuard, SessionGuard } from 'src/auth/guards/http-guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';
import { Verify2FADto } from './dto/two-fa-auth.dto.';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Two Factor Authentication')
@Controller('2fa')
export class TwoFaAuthController {
  constructor(private readonly twoFaService: TwoFaAuthService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('activate')
  @ApiOperation({
    summary:
      'Activates 2Fa for logged user and returns a qr code to register to authenticator app, if executed again qr code will be shown again',
  })
  async getQrCode(@AuthUser() user: User): Promise<string> {
    const qrCode = await this.twoFaService.getQrCode(user);
    return `<h2>Two-Factor Authentication Setup</h2>
		<p>Scan the QR code using a 2FA app:</p>
		<img src="${qrCode}" alt="QR Code">`;
  }

  @UseGuards(SessionGuard)
  @Post('verify')
  @ApiOperation({
    summary: 'Validates 2Fa for logged user if token is correct',
  })
  @ApiBody({
    type: Verify2FADto,
    examples: {
      example1: {
        value: {
          token: '2FA token from Authenticator app',
        },
      },
    },
  })
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
  @Patch('deactivate')
  @ApiOperation({ summary: 'Deactivates 2FA for the logged user' })
  async deavtivate2Fa(@AuthUser() user: User): Promise<string> {
    if (user.is2FaActive === false)
      throw new ConflictException('2FA is already deactivated');
    await this.twoFaService.deactivate2Fa(user);
    return '2Fa was deactivated';
  }
}
