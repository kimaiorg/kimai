import { Injectable } from '@nestjs/common';
import { TaskRepository } from '@/infrastructure/task/task.repository';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@/api/task/dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(dto: CreateTaskDto): Promise<Task | null> {
    return await this.taskRepository.create(dto);
  }

  async getTask(id: number): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }

  async listTasks(): Promise<Task[] | null> {
    return await this.taskRepository.findAll();
  }
}
