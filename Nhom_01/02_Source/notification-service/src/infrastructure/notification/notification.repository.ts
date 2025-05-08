import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { INotificationRepository } from '@/domain/notification/notification.repository.interface';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationRepository
  extends BaseRepository<Notification>
  implements INotificationRepository
{
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'notification');
  }
}
