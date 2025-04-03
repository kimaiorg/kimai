import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ITimesheetRepository } from '@/domain/timesheet/timesheet.repository.interface';
import { Timesheet } from '@prisma/client';

@Injectable()
export class TimesheetRepository
  extends BaseRepository<Timesheet>
  implements ITimesheetRepository
{
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'timesheet');
  }
}
