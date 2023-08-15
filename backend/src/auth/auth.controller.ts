import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthGuard42, SessionGuard } from './guards/Guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { AuthUser } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
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
  async handleRedirect(@Res() response: Response): Promise<void> {
    response.redirect('/auth/status'); // should redirect to the frontend
  }

  // Checks the authentication status of the user
  @Get('status')
  @UseGuards(SessionGuard)
  async status(@AuthUser() user: User): Promise<string> {
    if (user.is2FaActive && !user.is2FaValid) {
      return `${user.username}'s 2fa is not validated`;
    }
    await this.userService.updateUser(user, { isOnline: true });
    return 'You are Authenticated and your status is set to online!';
  }

  // Handles user logout
  @Get('logout')
  @UseGuards(SessionGuard)
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
