import { Injectable } from '@nestjs/common';
import { TeamRepository } from '@/infrastructure/team/team.repository';
import { Team } from '@prisma/client';
import { CreateTeamDto } from '@/api/team/dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async createTeam(dto: CreateTeamDto): Promise<Team | null> {
    return await this.teamRepository.create(dto);
  }

  async getTeam(id: number): Promise<Team | null> {
    return await this.teamRepository.findById(id);
  }

  async listTeams(): Promise<Team[] | null> {
    return await this.teamRepository.findAll();
  }
}
