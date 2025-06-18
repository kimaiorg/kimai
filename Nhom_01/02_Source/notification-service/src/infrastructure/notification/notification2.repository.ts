import { Prisma2Client } from '@/libs/database/prisma2.service';
import { Injectable } from '@nestjs/common';
import { INotificationRepository } from '@/domain/notification/notification.repository.interface';
import { Notification } from '@prisma/client';
import { Base2Repository } from '@/libs/database/repositories/base2.repository';

@Injectable()
export class Notification2Repository
  extends Base2Repository<Notification>
  implements INotificationRepository
{
  constructor(protected readonly prismaClient: Prisma2Client) {
    super(prismaClient, 'notification');
  }
}
