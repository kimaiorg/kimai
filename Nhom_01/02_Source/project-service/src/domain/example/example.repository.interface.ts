import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Example } from '@prisma/client';

export interface IExampleRepository extends BaseRepositoryInterface<Example> {}
