import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Notification } from '@prisma/client';

export interface INotificationRepository
  extends BaseRepositoryInterface<Notification> {}
