import { Body, Controller, Get, Patch, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthUser } from 'src/auth/auth.decorator';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { ChangeUserDto } from './dto';

@UseGuards(AuthenticatedGuard)
@ApiTags('Profile: CurrentUser')
@Controller()
export class CurrentUserController {
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

  @ApiOperation({
    summary:
      'Update logged user profile: username or avatar or both - redirect to users/"LOGGED-USER"',
  })
  @ApiBody({
    type: ChangeUserDto,
    examples: {
      example1: {
        value: {
          username: 'newUSername',
          avatar: 'new avatar Path',
        },
      },
    },
  })
  @Patch('profile')
  async patchCurrentUser(
    @AuthUser() user: User,
    @Body() body: ChangeUserDto, // Intentionally not used in this function
    @Res() response: Response,
  ): Promise<void> {
    response.redirect(`/users/` + user.username);
  }
}
