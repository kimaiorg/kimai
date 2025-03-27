import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IActivityRepository } from '@/domain/activity/activity.repository.interface';
import { Activity } from '@prisma/client';

@Injectable()
export class ActivityRepository
  extends BaseRepository<Activity>
  implements IActivityRepository
{
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'activity');
  }
}
