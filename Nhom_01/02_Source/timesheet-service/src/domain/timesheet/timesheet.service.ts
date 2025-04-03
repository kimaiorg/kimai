import { Injectable } from '@nestjs/common';
import { TimesheetRepository } from '@/infrastructure/timesheet/timesheet.repository';
import { Timesheet } from '@prisma/client';
import {
  EndTimesheetDto,
  ListTimesheetDto,
  StartTimesheetDto,
} from '@/api/timesheet/dto';
import { PaginationResponse } from '@/libs/response/pagination';

@Injectable()
export class TimesheetService {
  constructor(private readonly timesheetRepository: TimesheetRepository) {}

  async startTimesheet(dto: StartTimesheetDto): Promise<Timesheet | null> {
    const latestTimesheet = await this.timesheetRepository.findAll({
      where: {
        user_id: dto.user_id,
        end_time: null,
      },
    });
    if (latestTimesheet.length > 0) {
      throw new Error('You have not ended the previous timesheet.');
    }

    return await this.timesheetRepository.create(dto);
  }

  async endTimesheet(dto: EndTimesheetDto): Promise<Timesheet | null> {
    const latestTimesheet = await this.timesheetRepository.findAll({
      where: {
        user_id: dto.user_id,
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
        user_id: dto.user_id,
        end_time: null,
      },
      data: {
        end_time: end_date,
        duration: duration,
        description: dto.description,
      },
    });
  }

  async listTimesheets(
    dto: ListTimesheetDto,
  ): Promise<PaginationResponse<Timesheet>> {
    const count = (await this.timesheetRepository.count({
      where: {
        user_id: dto.user_id,
      },
    })) as number;

    const data = await this.timesheetRepository.findAll({
      where: {
        user_id: dto.user_id,
      },
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
