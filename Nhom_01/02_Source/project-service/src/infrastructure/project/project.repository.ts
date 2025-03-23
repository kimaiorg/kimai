import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '@/domain/project/project.repository.interface';
import { Project } from '@prisma/client';
import { CreateProjectDto } from '@/api/project/dto/create-project.dto';
import { ProjectEntity } from '@/libs/entities';

@Injectable()
export class ProjectRepository
  extends BaseRepository<Project>
  implements IProjectRepository
{
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'project');
  }

  async createProject(dto: CreateProjectDto): Promise<ProjectEntity> {
    const teams = dto.teams ? dto.teams.map((teamId) => ({ id: teamId })) : [];
    const customers = dto.customers
      ? dto.customers.map((customerId) => ({ id: customerId }))
      : [];

    return (await this.prismaClient.project.create({
      data: {
        name: dto.name,
        color: dto.color,
        project_number: dto.project_number,
        order_number: dto.order_number,
        order_date: dto.order_date,
        start_date: dto.start_date,
        end_date: dto.end_date,
        budget: dto.budget,
        teams: {
          connect: teams,
        },
        customers: {
          connect: customers,
        },
      },
      select: {
        id: true,
        name: true,
        color: true,
        project_number: true,
        order_number: true,
        order_date: true,
        start_date: true,
        end_date: true,
        budget: true,
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
        customers: {
          select: {
            id: true,
            name: true,
            company_name: true,
          },
        },
      },
    })) as unknown as ProjectEntity;
  }
}
