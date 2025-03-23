import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Team } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { TeamService } from '@/domain/team/team.service';
import {
  CreateTeamDto,
  createTeamSchema,
} from '@/api/team/dto/create-team.dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Post('')
  @Permissions(['create:teams'])
  @UsePipes(new ZodValidationPipe(createTeamSchema))
  async createTeam(@Body() dto: CreateTeamDto): Promise<Team | null> {
    return await this.teamService.createTeam(dto);
  }

  @Get(':id')
  @Permissions(['read:teams'])
  async getTeam(@Param('id', ParseIntPipe) id: number): Promise<Team | null> {
    return await this.teamService.getTeam(id);
  }

  @Get('')
  @Permissions(['read:teams'])
  async listTeams(): Promise<Team[] | null> {
    return await this.teamService.listTeams();
  }
}
