import { Controller, Get, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthUser } from 'src/auth/auth.decorator';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';

@UseGuards(AuthenticatedGuard)
@Controller()
export class CurrentUserController {
  constructor() {}

  // Redirects the authenticated user to their profile page
  @Get('profile')
  async getCurrentUser(
    @AuthUser() user: User,
    @Res() response: Response,
  ): Promise<void> {
    response.redirect(`/users/` + user.username);
  }

  // Redirects the PATCH request of the authenticated user to user.controller.updateUser
  @Patch('profile')
  async patchCurrentUser(
    @AuthUser() user: User,
    @Res() response: Response,
  ): Promise<void> {
    response.redirect(`/users/` + user.username);
  }
}
