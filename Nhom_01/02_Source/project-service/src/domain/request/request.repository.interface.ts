import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Request } from '@prisma/client';

export type IRequestRepository = BaseRepositoryInterface<Request>;
