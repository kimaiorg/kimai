import { CreateProjectDto } from '@/api/project/dto/create-project.dto';
import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { ProjectEntity } from '@/libs/entities';
import { Project } from '@prisma/client';

export interface IProjectRepository extends BaseRepositoryInterface<Project> {
  createProject(dto: CreateProjectDto): Promise<ProjectEntity>;
}
