import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '@/infrastructure/activity/activity.repository';
import { ProjectRepository } from '@/infrastructure/project/project.repository';
import { Activity } from '@prisma/client';
import { CreateActivityDto } from '@/api/activity/dto/create-activity.dto';
import { UpdateActivityDto } from '@/api/activity/dto/update-activity.dto';
import { ListActivityDto } from '@/api/activity/dto';
import { PaginationResponse } from '@/libs/response/pagination';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async createActivity(dto: CreateActivityDto): Promise<Activity | null> {
    const project = await this.projectRepository.findById(dto.project_id);
    if (!project) {
      throw new Error('Project not found');
    }

    const activities = await this.activityRepository.findAll({
      where: {
        project_id: dto.project_id,
      },
    });

    const totalBudget = activities.reduce(
      (acc, activity) => acc + (activity.budget ?? 0),
      0,
    );

    const remainingBudget = (project?.budget ?? 0) - totalBudget;

    if (dto.budget && project.budget && dto.budget > remainingBudget) {
      throw new Error('Activity budget cannot exceed project budget');
    }

    return await this.activityRepository.create(dto);
  }

  async getActivity(id: number): Promise<Activity | null> {
    return await this.activityRepository.findById(id);
  }

  async listActivities(
    dto: ListActivityDto,
  ): Promise<PaginationResponse<Activity>> {
    const count = await this.activityRepository.count({
      where: {
        project_id: dto.project_id,
        team_id: dto.team_id,
      },
    }) as number;

    const data = await this.activityRepository.findAll({
      where: {
        project_id: dto.project_id,
        team_id: dto.team_id,
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

  async updateAcitivty(
    id: number,
    dto: UpdateActivityDto,
  ): Promise<Activity | null> {
    return await this.activityRepository.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }
}
