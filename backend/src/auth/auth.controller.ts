import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard42, AuthenticatedGuard } from './guards/Guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // Initiates the 42 login process using AuthGuard42
  @Get('42/login')
  @UseGuards(AuthGuard42)
  async handleLogin(): Promise<string> {
    return '42 Authentication';
  }

  // Handles the callback after successful 42 authentication using AuthGuard42
  @Get('42/callback')
  @UseGuards(AuthGuard42)
  async handleRedirect(): Promise<string> {
    return 'Authentication successful!';
  }

  // Checks the authentication status of the user using AuthenticatedGuard
  @Get('status')
  @UseGuards(AuthenticatedGuard)
  async status(): Promise<string> {
    // Log the authenticated user and return user information
    return 'You are Authenticated!';
  }

  // Handles user logout
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.authService.deleteSession(request.sessionID);
    response.redirect('/auth/status');
  }
}
