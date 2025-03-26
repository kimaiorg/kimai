import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '@/infrastructure/activity/activity.repository';
import { ProjectRepository } from '@/infrastructure/project/project.repository';
import { Activity } from '@prisma/client';
import { CreateActivityDto } from '@/api/activity/dto/create-activity.dto';

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

  async listActivities(): Promise<Activity[] | null> {
    return await this.activityRepository.findAll();
  }
}
