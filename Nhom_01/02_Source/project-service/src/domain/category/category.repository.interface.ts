import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Category } from '@prisma/client';

export interface ICategoryRepository
  extends BaseRepositoryInterface<Category> {}
