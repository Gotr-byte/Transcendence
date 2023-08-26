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
  import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
  
  @UseGuards(AuthenticatedGuard)
  @Controller('matches')
  @ApiTags('Matches')
  export class matchesController {
    constructor(private readonly matchesService: matchesService) {}
  
    // Get all matches
    @Get('all')
    @ApiOperation({ summary: 'Get all existing matches' })
    async getAll(): Promise<ShowAnyMatchDto[]> {
      return  await this.matchesService.getAll();
    }

    // Get all matches for user
    @Get('all/user/')
    @ApiOperation({ summary: 'Get all existing matches for user' })
    async updateUser(
      @AuthUser() user: User,
    ): Promise<ShowAnyMatchDto[]> {
      return await this.matchesService.getAllForUser(user);
    }
}

