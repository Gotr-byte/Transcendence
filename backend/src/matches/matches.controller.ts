import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { matchesService } from './matches.service';
import { CreateMatchDto, ShowAnyMatchDto } from './dto/matchDto';
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
        return await this.matchesService.getAll();
    }

    // Get all matches for user
    @Get('all/user/')
    @ApiOperation({ summary: 'Get all existing matches for user' })
    async updateUser(@AuthUser() user: User): Promise<ShowAnyMatchDto[]> {
        return await this.matchesService.getAllForUser(user);
    }

    // Post a match
    @Put('create')
    @ApiOperation({ summary: 'Create a new match' })
    async createMatch(
        @Body() dto: CreateMatchDto): Promise<ShowAnyMatchDto> {
        return await this.matchesService.createMatch(dto);
    }

    // Delete a match
    @Patch('delete/:id')
    @ApiOperation({ summary: 'Delete a match' })
    async deleteMatch(@Param('id') id: number): Promise<ShowAnyMatchDto> {
        return await this.matchesService.deleteMatch(id);
    }

    // Create a match where one user disconnected
//     @Patch('disconnect/:id')
//     @ApiOperation({ summary: 'Create a match where one user disconnected' })
//     async disconnectMatch(@Body() dto: CreateMatchDto): Promise<ShowAnyMatchDto> {
//         return await this.matchesService.createDisconnectMatch(dto);
//     }
}
