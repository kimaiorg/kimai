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
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  CreateTeamSwagger,
  UpdateTeamSwagger,
  ListTeamSwaggerDto,
} from '@/api/team/swagger';
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
  @ApiQuery({ type: ListTeamSwaggerDto, required: false })
  @Permissions(['read:teams'])
  @UsePipes(new ZodValidationPipe(listTeamSchema))
  async listTeams(
    @Query() dto: ListTeamDto,
  ): Promise<PaginationResponse<Team>> {
    return await this.teamService.listTeams(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateTeamSwagger, required: false })
  @Permissions(['update:teams'])
  async update(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateTeamSchema)) dto: UpdateTeamDto,
  ): Promise<Team | null> {
    return await this.teamService.updateTeam(id, dto);
  }
}
