import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard42 } from 'src/auth/guards/Guards';

@Controller()
export class CurrentUserController {
  constructor() {}

  // @UseGuards(AuthGuard42)
  @Get('profile')
  redirectToCurrentUser(@Req() request: Request, @Res() response: Response) {
    const user = request.user;
    console.log(user);
    response.redirect(`/users/LOGGED-IN-USER`); //
  }
}
