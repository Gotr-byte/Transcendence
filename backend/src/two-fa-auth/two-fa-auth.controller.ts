import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TwoFaAuthService } from './two-fa-auth.service';
import { AuthenticatedGuard, SessionGuard } from 'src/auth/guards/http-guards';
import { AuthUser } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';
import { Verify2FADto } from './dto/two-fa-auth.dto.';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

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
  async getQrCode(
    @AuthUser() user: User,
    @Req() request: Request,
  ): Promise<string> {
    const qrCode = await this.twoFaService.getQrCode(user);
    (request.session as any).passport.user.is2FaActive = true;
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
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    if (user) {
      if (user.is2FaValid)
        throw new BadRequestException(`${user.username} is already verified`);
      await this.twoFaService.verifyToken(user, dto);
      (request.session as any).passport.user.is2FaValid = true;
    }
    return response.redirect('/auth/status');
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('deactivate')
  @ApiOperation({ summary: 'Deactivates 2FA for the logged user' })
  async deavtivate2Fa(
    @AuthUser() user: User,
    @Req() request: Request,
  ): Promise<string> {
    if (user.is2FaActive === false)
      throw new ConflictException('2FA is already deactivated');
    await this.twoFaService.deactivate2Fa(user);
    (request.session as any).passport.user.is2FaActive = false;
    return '2Fa was deactivated';
  }
}
