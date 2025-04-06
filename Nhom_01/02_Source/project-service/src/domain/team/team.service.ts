import { Injectable } from '@nestjs/common';
import { TeamRepository } from '@/infrastructure/team/team.repository';
import { Team } from '@prisma/client';
import { CreateTeamDto } from '@/api/team/dto/create-team.dto';
import { ListTeamDto } from '@/api/team/dto/list-team.dto';
import { PaginationResponse } from '@/libs/response/pagination';
import { UpdateTeamDto } from '@/api/team/dto/update-team.dto';
import { buildListQuery } from './builder';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async createTeam(dto: CreateTeamDto): Promise<Team | null> {
    return await this.teamRepository.create(dto);
  }

  async getTeam(id: number): Promise<Team | null> {
    return await this.teamRepository.findById(id, {
      where: {
        id: id,
        deleted_at: null,
      },
      include: {
        projects: true,
        activities: true,
      },
    });
  }

  async listTeams(dto: ListTeamDto): Promise<PaginationResponse<Team>> {
    const where = buildListQuery(dto);
    const count = (await this.teamRepository.count({ where })) as number;

    const data = await this.teamRepository.findAll({
      include: {
        projects: true,
        activities: true,
      },
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      orderBy: {
        [dto.sort_by]: dto.sort_order,
      },
    });

    return {
      data,
      metadata: {
        total: count || 0,
        totalPages: Math.ceil(count / dto.limit) || 0,
        page: dto.page,
        limit: dto.limit,
      },
    };
  }

  async updateTeam(id: number, dto: UpdateTeamDto): Promise<Team | null> {
    return await this.teamRepository.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: dto,
    });
  }
}
