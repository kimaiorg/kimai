import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Team } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { TeamService } from '@/domain/team/team.service';
import {
  CreateTeamDto,
  createTeamSchema,
  ListTeamDto,
  listTeamSchema,
  updateTeamSchema,
  UpdateTeamDto,
} from '@/api/team/dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ApiBody } from '@nestjs/swagger';
import { CreateTeamSwagger } from '@/api/team/swagger';
import { PaginationResponse } from '@/libs/response/pagination';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Post('')
  @ApiBody({ type: CreateTeamSwagger })
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
  @UsePipes(new ZodValidationPipe(listTeamSchema))
  async listTeams(
    @Query() dto: ListTeamDto,
  ): Promise<PaginationResponse<Team>> {
    return await this.teamService.listTeams(dto);
  }

  @Put(':id')
  @Permissions(['update:teams'])
  @UsePipes(new ZodValidationPipe(updateTeamSchema))
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateTeamDto,
  ): Promise<Team | null> {
    return await this.teamService.updateTeam(id, dto);
  }
}
