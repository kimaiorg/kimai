import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/infrastructure/project/project.repository';
import { Project } from '@prisma/client';
import { CreateProjectDto } from '@/api/project/dto/create-project.dto';
import { ProjectEntity } from '@/libs/entities';
import { PaginationResponse } from '@/libs/response/pagination';
import { ListProjectDto } from '@/api/project/dto/list-project.dto';
import { UpdateProjectDto } from '@/api/project/dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async createProject(dto: CreateProjectDto): Promise<ProjectEntity | null> {
    return await this.projectRepository.createProject(dto);
  }

  async getProject(id: number): Promise<Project | null> {
    return await this.projectRepository.findById(id, {
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
        customer: {
          select: {
            id: true,
            name: true,
            company_name: true,
          },
        },
      },
    });
  }

  async listProjects(
    dto: ListProjectDto,
  ): Promise<PaginationResponse<Project>> {
    const count = (await this.projectRepository.count({
      where: {
        customer_id: dto.customer_id,
      },
    })) as number;

    const data = await this.projectRepository.findAll({
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
        customer: {
          select: {
            id: true,
            name: true,
            company_name: true,
          },
        },
      },
      where: {
        customer_id: dto.customer_id,
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      orderBy: {
        [dto.sortBy]: dto.sortOrder,
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

  async updateProject(
    id: number,
    dto: UpdateProjectDto,
  ): Promise<Project | null> {
    return await this.projectRepository.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }
}
