import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Timesheet } from '@prisma/client';

export interface ITimesheetRepository
  extends BaseRepositoryInterface<Timesheet> {}
