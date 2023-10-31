import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/auth.decorator';
import { AuthenticatedGuard } from 'src/auth/guards/http-guards';
import { ChangeUserDto, FileUploadDto, ShowLoggedUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImagekitService } from 'src/imagekit/imagekit.service';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@UseGuards(AuthenticatedGuard)
@ApiTags('Profile: CurrentUser')
@Controller('profile')
export class CurrentUserController {
  constructor(
    private readonly imagekit: ImagekitService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Redirects the authenticated user to their profile page (id, username, isOnline, avatar, is2FaActive)',
  })
  async getCurrentUser(
    @AuthUser() user: User,
    @Res() response: Response,
  ): Promise<void> {
    response.redirect('/users/' + user.username);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update logged users username',
  })
  @ApiBody({
    type: ChangeUserDto,
    examples: {
      example1: {
        value: {
          username: 'newUsername',
        },
      },
    },
  })
  async updateUser(
    @AuthUser() user: User,
    @Body() dto: ChangeUserDto,
    @Req() request: Request,
  ): Promise<ShowLoggedUserDto> {
    const updatedUser = await this.userService.updateUser(user, dto);
    (request.session as any).passport.user.username = dto.username;
    if (dto.username && (dto.username !== user.username) && !user.achievements.includes('DRALIAS'))
      await this.userService.addAchievement(user.id, 'DRALIAS');
    return updatedUser;
  }

  @Patch('upload-avatar')
  @ApiOperation({
    summary:
      'Uploads a new avatar profile picture, max size: 10mb, allowed types: jpeg, jpg, bmp and png',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 1024 * 1024 * 10 },
    }),
  )
  async uploadAvatar(
    @AuthUser() user: User,
    @Req() request: Request,
    @Body() fileUploadDto: FileUploadDto, // Intentionally not used, but implemented to allow uploads through swagger-ui
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ShowLoggedUserDto> {
    const updatedUser = await this.imagekit.uploadAvatar(image, user.id);
    (request.session as any).passport.user.avatar = updatedUser.avatar;
    if (!user.achievements.includes('AVATARISH'))
      await this.userService.addAchievement(user.id, 'AVATARISH');
    return ShowLoggedUserDto.from(updatedUser);
  }
}
