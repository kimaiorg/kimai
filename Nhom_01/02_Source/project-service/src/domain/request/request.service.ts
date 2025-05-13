import { Injectable } from '@nestjs/common';
import { Request, RequestType, Task } from '@prisma/client';
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

@Injectable()
export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly taskRepository: TaskRepository,
    private readonly timesheetHttpService: TimesheetHttpService,
  ) {}

  async createRequest(
    dto: CreateRequestDto,
    userId: string,
  ): Promise<Request | null> {
    let target: Task | JSON | null = null;
    if (dto.type === RequestType.CHANGE_EXPENSE_QUANTITY) {
      target = await this.taskRepository.findById(dto.target_id, {
        include: {
          expense: true,
        },
      });
    } else if (dto.type === RequestType.START_TIMESHEET) {
      const response = await this.timesheetHttpService.callApi(
        `/timesheets/${dto.target_id}`,
        'post',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-Code': ENV.internal_code,
          },
        },
      );
      target = (response as { data: JSON }).data;
    }

    return await this.requestRepository.create({
      comment: dto.comment,
      type: dto.type,
      
      target_id: dto.target_id,
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
        project: true,
        team: true,
        tasks: true,
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

  async updateRequest(
    id: number,
    dto: UpdateRequestDto,
  ): Promise<Request | null> {
    return await this.requestRepository.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: dto,
    });
  }

  async deleteRequest(id: number): Promise<boolean> {
    return await this.requestRepository.delete(id);
  }

  async getRequest(id: number): Promise<Request | null> {
    return await this.requestRepository.findById(id);
  }
}
