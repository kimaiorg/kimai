import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ITaskRepository } from '@/domain/task/task.repository.interface';
import { Task } from '@prisma/client';

@Injectable()
export class TaskRepository
  extends BaseRepository<Task>
  implements ITaskRepository
{
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'task');
  }
}
