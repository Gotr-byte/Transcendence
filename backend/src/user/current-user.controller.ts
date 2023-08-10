import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class CurrentUserController {
  constructor() {}

  @Get('profile')
  redirectToCurrentUser(@Res() res: Response) {
    // const { username } = req.user;
    res.redirect(`/users/LOGGED-IN-USER`); //
  }
}
