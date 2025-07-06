import { Inject, Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/infrastructure/project/project.repository';
import { Project } from '@prisma/client';
import { CreateProjectDto } from '@/api/project/dto/create-project.dto';
import { ProjectEntity } from '@/libs/entities';
import { PaginationResponse } from '@/libs/response/pagination';
import { ListProjectDto } from '@/api/project/dto/list-project.dto';
import { UpdateProjectDto } from '@/api/project/dto/update-project.dto';
import { buildListQuery } from './builder';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { join } from 'path';
import * as fs from 'fs';


@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createProject(dto: CreateProjectDto): Promise<ProjectEntity | null> {
    const project = await this.projectRepository.createProject(dto);
    await this.cacheManager.set(`post:${project.id}`, project, 60);
    return project;
  }

  async getProject(id: number): Promise<Project | null> {
    return await this.projectRepository.findById(id, {
      where: {
        id: id,
        deleted_at: null,
      },
      include: {
        teams: true,
        customer: true,
      },
    });
  }

  async listProjects(
    dto: ListProjectDto,
  ): Promise<PaginationResponse<Project>> {
    const where: any = buildListQuery(dto);
    const count = (await this.projectRepository.count({
      where,
    })) as number;

    const data = await this.projectRepository.findAll({
      include: {
        teams: true,
        customer: true,
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

  async updateProject(
    id: number,
    dto: UpdateProjectDto,
  ): Promise<Project | null> {
    const project = await this.projectRepository.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: dto,
    });

    await this.cacheManager.set(`post:${id}`, project, 60);

    return project;
  }

  async deleteProject(id: number): Promise<boolean | null> {
    const project = await this.projectRepository.delete(id);

    if (project) {
      await this.cacheManager.del(`post:${id}`);
    }

    return project;
  }

  getFilePath(userId: string, fileName: string): string {
    const shard = userId.slice(0, 2);
    return `/data/files/${shard}/${userId}/${fileName}`;
  }

  getShardedPath(userId: string, fileName: string): string {
    const shard = userId.slice(0, 2);
    const dirPath = join(__dirname, '..', 'uploads', shard, userId);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  
    return join(dirPath, fileName);
  }
}
