import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/infrastructure/project/project.repository';
import { Project } from '@prisma/client';
import { CreateProjectDto } from '@/api/project/dto/create-project.dto';
import { ProjectEntity } from '@/libs/entities';

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
        customers: {
          select: {
            id: true,
            name: true,
            company_name: true,
          },
        },
      },
    });
  }

  async listProjects(): Promise<Project[] | null> {
    return await this.projectRepository.findAll({
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
    });
  }
}
