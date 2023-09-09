import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ShowAnyUserDto,
  ChangeUserDto,
  ShowLoggedUserDto,
  ShowUsersDto,
} from './dto';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/auth.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ImgurService } from 'src/imgur/imgur.service';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthenticatedGuard)
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly imgurService: ImgurService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAll(): Promise<ShowUsersDto> {
    const users = await this.userService.getAll();
    return users;
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get user by username' })
  async getUserByName(
    @Param('username') username: string,
  ): Promise<ShowLoggedUserDto | ShowAnyUserDto> {
    const user = await this.userService.getUserByName(username);
    return user.username === username
      ? ShowLoggedUserDto.from(user)
      : ShowAnyUserDto.from(user);
  }

  @Patch(':username')
  @ApiOperation({ summary: 'Update user profile: username or avatar or both' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
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
  async updateUser(
    @Param('username') username: string,
    @AuthUser() user: User,
    @Body() dto: ChangeUserDto,
  ): Promise<ShowLoggedUserDto> {
    // Validate that the authenticated user is authorized to update the profile
    console.log(dto);
    if (user.username != username)
      throw new ForbiddenException(
        `User: '${user.username} is not allowed to patch '${username}'`,
      );
    const updatedUser = await this.userService.updateUser(user, dto);
    return updatedUser;
  }

  @Patch(':username/upload-avatar')
  @UseInterceptors(FileInterceptor('image')) // 'image' should match the field name in your form
  async uploadAvatar(
    @Param('username') username: string,
    @AuthUser() user: User,
    @UploadedFile() image: Express.Multer.File, // Access the uploaded file via @UploadedFile()
  ) {
    if (!image) {
      return 'No file uploaded';
    }

    // Your code to handle the uploaded file goes here
    try {
      const updatedUser = await this.imgurService.uploadPicture(image, user.id);
      return updatedUser;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return 'Error uploading the avatar.';
    }
  }

  @Get(':username/achievements')
  @ApiOperation({ summary: "Get user's achievements" })
  async getUserAchievements(
    @Param('username') username: string,
  ): Promise<string[]> {
    const user = await this.userService.getUserByName(username);
    return user.achievements;
  }
}
