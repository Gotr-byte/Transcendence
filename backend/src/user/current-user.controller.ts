import { Controller, Get, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthUser } from 'src/auth/auth.decorator';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';

@UseGuards(AuthenticatedGuard)
@ApiTags('User-relations: CurrentUser')
@Controller()
export class CurrentUserController {
  constructor() {}

  @Get('profile')
  @ApiOperation({
    summary:
      'Redirects the authenticated user to their profile page (id, username, isOnline, avatar, is2FaActive)',
  })
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
