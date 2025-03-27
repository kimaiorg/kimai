import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Task } from '@prisma/client';

export interface ITaskRepository extends BaseRepositoryInterface<Task> {}
