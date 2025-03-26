import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Activity } from '@prisma/client';

export interface IActivityRepository
  extends BaseRepositoryInterface<Activity> {}
