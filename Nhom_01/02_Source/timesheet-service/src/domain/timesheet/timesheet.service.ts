import { Inject, Injectable } from '@nestjs/common';
import { TimesheetRepository } from '@/infrastructure/timesheet/timesheet.repository';
import { Timesheet } from '@prisma/client';
import {
  ListTimesheetsDto,
  ListTimesheetsMeDto,
  StartTimesheetDto,
  UpdateTimesheetDto,
} from '@/api/timesheet/dto';
import { PaginationResponse } from '@/libs/response/pagination';
import {
  buildListTimesheetsMeQuery,
  buildListTimesheetsQuery,
} from './builder';
import { ProjectHttpService } from '@/libs/http/project-http.service';
import { RabbitmqService } from '@/libs/rabbitmq/rabbitmq.service';
import { ENV } from '@/libs/configs/env';
import { ActivityResponse } from './response';
@Injectable()
export class TimesheetService {
  constructor(
    private readonly timesheetRepository: TimesheetRepository,
    @Inject('RABBITMQ_SERVICE_NOTIFICATION')
    private readonly rabbitmqService: RabbitmqService,
    private readonly projectHttpService: ProjectHttpService,
  ) {}

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

    const activity: ActivityResponse = await this.projectHttpService.callApi(
      `api/v1/activities/${dto.activity_id}`,
      'get',
      {},
      {
        headers: {
          'X-Internal-Code': ENV.internal_code,
        },
      },
    );

    const timesheet = await this.timesheetRepository.create({
      user_id: userId,
      username: dto.username,
      description: dto.description,
      project_id: dto.project_id,
      activity_id: dto.activity_id,
      task_id: dto.task_id,
    });

    await this.rabbitmqService.emit(
      { cmd: 'create_notification' },
      {
        title: 'Request Start Timesheet',
        content: `${dto.username} has requested to start a timesheet`,
        type: 'timesheet_request',
        target_id: timesheet.id.toString(),
        user_id: activity.team.lead,
      },
    );

    return timesheet;
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
        end_time: end_date,
        status: 'stopped',
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

  async getTimesheet(id: number): Promise<Timesheet | null> {
    return await this.timesheetRepository.findById(id);
  }

  async updateTimesheet(
    id: number,
    dto: UpdateTimesheetDto,
  ): Promise<Timesheet | null> {
    return await this.timesheetRepository.update({
      where: { id },
      data: dto,
    });
  }
}
