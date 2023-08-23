import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    Patch,
    UseGuards,
    ValidationPipe,
  } from '@nestjs/common';
  import { matchesService } from './matches.service';
  import { ShowAnyMatchDto } from './dto/matchDto';
  import { AuthenticatedGuard } from 'src/auth/guards/Guards';
  import { User } from '@prisma/client';
  import { AuthUser } from 'src/auth/auth.decorator';
  
  @UseGuards(AuthenticatedGuard)
  @Controller('matches')
  export class UserController {
    constructor(private readonly matchesService: matchesService) {}
  
    // Get all matches
    @Get('all')
    async getAll(): Promise<ShowAnyMatchDto[]> {
      return  await this.matchesService.getAll();
    }

    // Get all matches for user
    @Get('all/user/')
    async updateUser(
      @AuthUser() user: User,
    ): Promise<ShowAnyMatchDto[]> {
      return await this.matchesService.getAllForUser(user);
    }
}