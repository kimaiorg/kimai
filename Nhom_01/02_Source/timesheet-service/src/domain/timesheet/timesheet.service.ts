import { Injectable } from '@nestjs/common';
import { TimesheetRepository } from '@/infrastructure/timesheet/timesheet.repository';
import { Timesheet } from '@prisma/client';
import {
  ListTimesheetsDto,
  ListTimesheetsMeDto,
  StartTimesheetDto,
} from '@/api/timesheet/dto';
import { PaginationResponse } from '@/libs/response/pagination';
import {
  buildListTimesheetsMeQuery,
  buildListTimesheetsQuery,
} from './builder';

@Injectable()
export class TimesheetService {
  constructor(private readonly timesheetRepository: TimesheetRepository) {}

  async startTimesheet(
    userId: string,
    dto: StartTimesheetDto,
  ): Promise<Timesheet | null> {
    const latestTimesheet = await this.timesheetRepository.findAll({
      where: {
        user_id: userId,
        end_time: null,
      },
    });
    if (latestTimesheet.length > 0) {
      throw new Error('You have not ended the previous timesheet.');
    }

    return await this.timesheetRepository.create({
      user_id: userId,
      username: dto.username,
      description: dto.description,
      project_id: dto.project_id,
      activity_id: dto.activity_id,
      task_id: dto.task_id,
    });
  }

  async endTimesheet(userId: string): Promise<Timesheet | null> {
    const latestTimesheet = await this.timesheetRepository.findAll({
      where: {
        user_id: userId,
        end_time: null,
      },
    });
    if (latestTimesheet.length == 0) {
      throw new Error(`You don't have any timesheet to end`);
    }

    const end_date = new Date();
    const duration = Math.floor(
      (end_date.getTime() - latestTimesheet[0].start_time.getTime()) / 1000,
    );

    return await this.timesheetRepository.update({
      where: {
        user_id: userId,
        end_time: null,
      },
      data: {
        status: 'stopped',
        end_time: end_date,
        duration: duration,
      },
    });
  }

  async listTimesheets(
    dto: ListTimesheetsDto,
  ): Promise<PaginationResponse<Timesheet>> {
    const where = buildListTimesheetsQuery(dto);

    const count = (await this.timesheetRepository.count({
      where,
    })) as number;

    const data = await this.timesheetRepository.findAll({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      orderBy: {
        [dto.sortBy]: dto.sortOrder,
      },
    });

    return {
      data,
      metadata: {
        total: count || 0,
        totalPages: Math.ceil(count / dto.limit) || 0,
        page: dto.page,
        limit: dto.limit,
      },
    };
  }

  async listTimesheetsMe(
    userId: string,
    dto: ListTimesheetsMeDto,
  ): Promise<PaginationResponse<Timesheet>> {
    const where = buildListTimesheetsMeQuery(userId, dto);

    const count = (await this.timesheetRepository.count({
      where,
    })) as number;

    const data = await this.timesheetRepository.findAll({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      orderBy: {
        [dto.sortBy]: dto.sortOrder,
      },
    });

    return {
      data,
      metadata: {
        total: count || 0,
        totalPages: Math.ceil(count / dto.limit) || 0,
        page: dto.page,
        limit: dto.limit,
      },
    };
  }
}
