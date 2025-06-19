import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Activity,
  Request,
  RequestStatus,
  RequestType,
  Task,
} from '@prisma/client';
import { PaginationResponse } from '@/libs/response/pagination';
import { buildListQuery } from './builder';
import { RequestRepository } from '@/infrastructure/request/request.repository';
import {
  CreateRequestDto,
  ListRequestDto,
  UpdateRequestDto,
} from '@/api/request/dto';
import { TaskRepository } from '@/infrastructure/task/task.repository';
import { TimesheetHttpService } from '@/libs/http/timesheet-http.service';
import { ENV } from '@/libs/configs/env';
import { RabbitmqService } from '@/libs/rabbitmq/rabbitmq.service';
import { PrismaClient } from '@/libs/database/prisma.service';
@Injectable()
export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly taskRepository: TaskRepository,
    private readonly timesheetHttpService: TimesheetHttpService,
    @Inject('RABBITMQ_SERVICE_NOTIFICATION')
    private readonly rabbitmqService: RabbitmqService,
    private readonly prisma: PrismaClient,
  ) {}

  async createRequest(
    dto: CreateRequestDto,
    userId: string,
  ): Promise<Request | null> {
    let target: (Task & { activity: Activity }) | JSON | null = null;
    if (dto.type === RequestType.CHANGE_EXPENSE_QUANTITY) {
      target = (await this.taskRepository.findById(dto.target_id, {
        include: {
          expense: true,
          activity: true,
        },
      })) as Task & { activity: Activity };

      const team = await this.prisma.team.findUnique({
        where: {
          id: target?.activity.team_id,
        },
      });

      await this.prisma.task.update({
        where: { id: target?.id },
        data: {
          request_status: RequestStatus.PROCESSING,
        },
      });

      await this.rabbitmqService.emit(
        { cmd: 'create_notification' },
        {
          title: 'Change Expense Quantity',
          content: `One of your team members has requested to change the quantity of ${target?.title} from ${target?.quantity} to ${dto.request_data?.quantity}`,
          type: 'expense_request',
          target_id: target?.id.toString(),
          user_id: team?.lead,
        },
      );
    } else if (dto.type === RequestType.START_TIMESHEET) {
      target = await this.timesheetHttpService.get(
        `api/v1/timesheets/${dto.target_id}`,
        {},
        {
          headers: {
            'X-Internal-Code': ENV.internal_code,
          },
        },
      );
    }

    return await this.requestRepository.create({
      comment: dto.comment,
      type: dto.type,
      target_id: dto.target_id,
      team_id: dto.team_id ?? null,
      user_id: userId,
      previous_data: target ?? {},
      request_data: dto.request_data ?? {},
    });
  }

  async listRequests(
    dto: ListRequestDto,
  ): Promise<PaginationResponse<Request>> {
    const where = buildListQuery(dto);
    const count = (await this.requestRepository.count({
      where,
    })) as number;

    const data = await this.requestRepository.findAll({
      where,
      include: {
        team: true,
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      orderBy: {
        [dto.sort_by]: dto.sort_order,
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

  async deleteRequest(id: number): Promise<boolean> {
    return await this.requestRepository.delete(id);
  }

  async getRequest(id: number): Promise<Request | null> {
    return await this.requestRepository.findById(id, {
      include: {
        team: true,
      },
    });
  }

  async updateRequest(
    id: number,
    dto: UpdateRequestDto,
  ): Promise<{ success: boolean }> {
    const request = await this.requestRepository.findById(id);
    if (!request) {
      throw new BadRequestException('Request not found');
    }

    if (request.status !== RequestStatus.PROCESSING) {
      throw new BadRequestException('Request is not processing');
    }

    if (!request.team_id) {
      throw new BadRequestException('Request has no team');
    }

    if (dto.status === RequestStatus.APPROVED) {
      if (request.type === RequestType.CHANGE_EXPENSE_QUANTITY) {
        const requestData = request.request_data as {
          quantity: number;
        };

        await this.taskRepository.update({
          where: { id: request.target_id },
          data: {
            request_status: RequestStatus.APPROVED,
            quantity: requestData.quantity,
          },
        });
      } else if (request.type === RequestType.START_TIMESHEET) {
        await this.timesheetHttpService.put(
          `${ENV.timesheet_service.url}/api/v1/timesheets/${request.target_id}`,
          {
            request_status: dto.status,
          },
          {
            headers: {
              'X-Internal-Code': ENV.internal_code,
            },
          },
        );
      }
    } else {
      if (request.type === RequestType.START_TIMESHEET) {
        await this.timesheetHttpService.put(
          `${ENV.timesheet_service.url}/api/v1/timesheets/${request.target_id}`,
          {
            request_status: dto.status,
          },
          {
            headers: {
              'X-Internal-Code': ENV.internal_code,
            },
          },
        );
      } else if (request.type === RequestType.CHANGE_EXPENSE_QUANTITY) {
        await this.taskRepository.update({
          where: { id: request.target_id },
          data: { request_status: RequestStatus.REJECTED },
        });
      }
    }

    await this.rabbitmqService.emit(
      { cmd: 'create_notification' },
      {
        title: 'Change Request Status',
        content: `Your team lead has just ${dto.status === RequestStatus.APPROVED ? 'approved' : 'rejected'} your request`,
        type: 'change_status_request',
        target_id: request.target_id.toString(),
        user_id: request.user_id,
      },
    );

    await this.requestRepository.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: {
        status: dto.status,
      },
    });

    return { success: true };
  }
}
