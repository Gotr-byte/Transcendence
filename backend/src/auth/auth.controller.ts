import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard42 } from './guards/Guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  @Get('42/login')
  @UseGuards(AuthGuard42)
  handleLogin() {
    return { msg: '42 Authentication' };
  }

  @Get('42/callback')
  @UseGuards(AuthGuard42)
  handleRedirect() {
    return { msg: 'Authentication successful!' };
  }

  @Get('status')
  getStatus(@Req() request: Request) {
    console.log(request.user)
    if (request.user) {
      return { msg: 'Authenticated'}
    } else {
      return { msg: 'Not Authenticated'}
    }
  }
}
