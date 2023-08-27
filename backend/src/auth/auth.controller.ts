import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard42, SessionGuard } from './guards/Guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { AuthUser } from './auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('42/login')
  @ApiOperation({ summary: 'Initiate the 42 login process' })
  @UseGuards(AuthGuard42)
  async handleLogin(): Promise<string> {
    return '42 Authentication';
  }

  @Get('42/callback')
  @ApiOperation({ summary: 'Handle successful 42 authentication callback' })
  @UseGuards(AuthGuard42)
  async handleRedirect(@Res() response: Response): Promise<void> {
    response.redirect(process.env.FRONTEND_URL || '/auth/status');
  }

  @Get('status')
  @ApiOperation({ summary: 'Check user authentication status' })
  @UseGuards(SessionGuard)
  async status(@AuthUser() user: User): Promise<string> {
    if (user.is2FaActive && !user.is2FaValid) {
      return `${user.username}'s 2fa is not validated`;
    }
    await this.userService.updateUser(user, { isOnline: true });
    return 'You are Authenticated and your status is set to online!';
  }

  @Get('logout')
  @ApiOperation({ summary: 'Handle user logout' })
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
