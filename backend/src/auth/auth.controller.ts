import {
  Controller,
  Get,
  Inject,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard42, SessionGuard } from './guards/http-guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { AuthUser } from './auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShowLoggedUserDto } from 'src/user/dto';

@ApiTags('Authentication')
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
    response.redirect(process.env.FRONTEND_URL || 'https://localhost:5173');
  }

  @Get('status')
  @ApiOperation({ summary: 'Check user authentication status' })
  async status(@Session() session: Record<string, any>): Promise<string> {
    const user = session?.passport?.user;
    console.log(user);
    if (!user) return 'Session not authenticated';
    if (user.is2FaActive) {
      if (user.is2FaValid) {
        return 'User Authenticated';
      }
      return '2Fa not validated';
    }
    return 'User Authenticated';
  }

  @Get('session-status')
  @ApiOperation({ summary: 'Check if session is authenticated status' })
  async sessionStatus(
    @Session() session: Record<string, any>,
  ): Promise<string> {
    const user = session?.passport?.user;
    if (!user) return 'Session Invalid';
    return 'Session Valid';
  }

  @Get('logout')
  @ApiOperation({ summary: 'Handle user logout' })
  @UseGuards(SessionGuard)
  async logout(
    @Req() request: Request,
    @AuthUser() user: User,
  ): Promise<boolean> {
    await this.userService.updateUser(user, {
      isOnline: false,
      is2FaValid: false,
    });
    await this.authService.deleteSession(request.sessionID);
    return true;
  }
}
