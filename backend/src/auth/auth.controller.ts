import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard42, AuthenticatedGuard } from './guards/Guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthUser } from './auth.decorator';
import { User } from '@prisma/client';
import { Verify2FADto } from 'src/two-fa-auth/dto/two-fa-auth.dto.';
import { TwoFaAuthService } from 'src/two-fa-auth/two-fa-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private readonly twoFaAuthService: TwoFaAuthService,
  ) {}
  // Initiates the 42 login process using AuthGuard42
  @Get('42/login')
  @UseGuards(AuthGuard42)
  async handleLogin(): Promise<string> {
    return '42 Authentication';
  }

  // Handles the callback after successful 42 authentication using AuthGuard42
  @Get('42/callback')
  @UseGuards(AuthGuard42)
  async handleRedirect(
    @AuthUser() user: User,
    @Res() response: Response,
  ): Promise<void> {
    response.redirect('/auth/check2fa');
  }

  // Checks the authentication status of the user using AuthenticatedGuard
  @Get('status')
  @UseGuards(AuthenticatedGuard)
  async status(): Promise<string> {
    // Log the authenticated user and return user information
    return 'You are Authenticated!';
  }

  @UseGuards(AuthenticatedGuard)
  @Get('check2fa')
  async check2fa(@AuthUser() user: User) {
    // Check if 2FA is enabled for the user
    if (!user.is2FaActive) {
      await this.userService.updateUser(user, { isOnline: true });
      return 'You are authenticated';
    } else return 'Validate through POST auth/check2fa';
  }

  @UseGuards(AuthenticatedGuard)
  @Post('check2fa')
  async login2FA(
    @AuthUser() user: User,
    @Body(new ValidationPipe()) dto: Verify2FADto,
  ): Promise<string> {
    if (user.is2FaActive) {
      await this.twoFaAuthService.verifyToken(user, dto);
      await this.userService.updateUser(user, { isOnline: true });
      return '2Fa successfully validated';
    }
    return '2Fa is not activated';
  }

  // Handles user logout
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(
    @Req() request: Request,
    @Res() response: Response,
    @AuthUser() user: User,
  ): Promise<void> {
    await this.userService.updateUser(user, {
      isOnline: false,
      is2FaValid: false,
    });
    await this.authService.deleteSession(request.sessionID);
    response.redirect('/auth/status');
  }
}
