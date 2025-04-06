import { Injectable } from '@nestjs/common';
import { TaskRepository } from '@/infrastructure/task/task.repository';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@/api/task/dto/create-task.dto';
import { ListTaskDto, UpdateTaskDto } from '@/api/task/dto';
import { PaginationResponse } from '@/libs/response/pagination';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(dto: CreateTaskDto): Promise<Task | null> {
    return await this.taskRepository.create(dto);
  }

  async getTask(id: number): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }

  async listTasks(dto: ListTaskDto): Promise<PaginationResponse<Task>> {
    const count = (await this.taskRepository.count({
      where: {
        activity_id: dto.activity_id,
        user_id: dto.user_id,
      },
    })) as number;

    const data = await this.taskRepository.findAll({
      where: {
        activity_id: dto.activity_id,
        user_id: dto.user_id,
      },
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

  async updateTask(id: number, dto: UpdateTaskDto): Promise<Task | null> {
    return await this.taskRepository.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }
}
