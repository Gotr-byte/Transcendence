import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('42/login')
  handleLogin() {
    return { msg: '42 Authentication' };
  }

  @Get('42/redirected')
  handleRedirect() {
    return { msg: 'OK' };
  }
}
