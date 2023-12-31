import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
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
import { Verify2FADto } from './dto/two-fa-auth.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { contains } from 'class-validator';
import { UserService } from 'src/user/user.service';

@ApiTags('Two Factor Authentication')
@Controller('2fa')
export class TwoFaAuthController {
  constructor(private readonly twoFaService: TwoFaAuthService, private readonly userService: UserService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('qrcode')
  @ApiOperation({
    summary:
      'Generate qr code to register to authenticator app, if executed again qr code will be shown again',
  })
  async getQrCode(
    @AuthUser() user: User,
    @Req() request: Request,
  ): Promise<string> {
    const qrCode = await this.twoFaService.getQrCode(user);
    return `<h2>Two-Factor Authentication Setup</h2>
		<p>Scan the QR code using a 2FA app:</p>
		<img src="${qrCode}" alt="QR Code">`;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('activate')
  @ApiOperation({
    summary: 'Post the 2fa token after succes, 2fa is enabled',
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
  async activate2fa(
    @AuthUser() user: User,
    @Body() dto: Verify2FADto,
    @Req() request: Request,
  ): Promise<void> {
    if (user) {
      if (user.is2FaValid)
        throw new BadRequestException(`${user.username} is already verified`);
      await this.twoFaService.verifyToken(user, dto);
      (request.session as any).passport.user.is2FaActive = true;
      (request.session as any).passport.user.is2FaValid = true;
      if (!user.achievements.includes('PARANOID'))
        await this.userService.addAchievement(user.id, 'PARANOID');
    }
  }

  @UseGuards(SessionGuard)
  @Get('is2faactive')
  @ApiOperation({
    summary: 'Returns a boolean if 2fa is active or not',
  })
  async is2FaActive(@AuthUser() user: User): Promise<boolean> {
    return user.is2FaActive;
  }

  @UseGuards(SessionGuard)
  @Get('is2favalid')
  @ApiOperation({
    summary: 'Returns a boolean if 2fa is validated or not',
  })
  async is2FaValid(@AuthUser() user: User): Promise<boolean> {
    return user.is2FaValid;
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
  ): Promise<void> {
    if (user) {
      if (user.is2FaValid)
        throw new BadRequestException(`${user.username} is already verified`);
      await this.twoFaService.verifyToken(user, dto);
      (request.session as any).passport.user.is2FaValid = true;
    }
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
    (request.session as any).passport.user.is2FaValid = false;
    (request.session as any).passport.user.twoFaSecret = '';
    return '2Fa was deactivated';
  }
}
