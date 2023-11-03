import {
  Controller,
  Get,
  Inject,
  Post,
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
  @ApiOperation({
    summary: 'Check if session exists, so if the user is authenticated via 42',
  })
  async sessionStatus(
    @Session() session: Record<string, any>,
  ): Promise<string> {
    const user = session?.passport?.user;
    if (!user) return 'Session Invalid';
    const sessions = await this.authService.getUserSessions(user.id);
    if (!sessions) return 'Session Invalid';
    return 'Session Valid';
  }

  @Post('check-existing-sessions')
  @ApiOperation({
    summary:
      'Checks if a session for that user exist, if a session from another device already exists i will be checked if that user is online on that session, if yes returns false, if no session exists or user is offline on that other session returns false and removes the old session',
  })
  @UseGuards(SessionGuard)
  async checkExistingSessions(@AuthUser() user: User, @Res() response: Response): Promise<void> {
    const sessions = await this.authService.getUserSessions(user.id);

    if (sessions.length < 2) {
      response.send({ removeThisSession: false });
      return;
  }
  if (!user.isOnline) {
      await this.authService.deleteSession(sessions[0].sid);
      response.send({ removeThisSession: false });
      return;
  }
  await this.authService.deleteSession(sessions[1].sid);
  response.cookie('connect.sid', '', { expires: new Date(0), httpOnly: true });
  response.send({ removeThisSession: true });
  return;
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
