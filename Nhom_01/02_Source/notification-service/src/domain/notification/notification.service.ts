import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '@/infrastructure/notification/notification.repository';
import { Notification } from '@prisma/client';
import { PaginationResponse } from '@/libs/response/pagination';
import { CreateNotificationDto } from '@/api/notification/dto';
import { buildListNotificationsQuery } from './builder';
import { ListNotificationsDto } from '@/api/notification/dto/list-notifications.dto';
import { UpdateNotificationDto } from '@/api/notification/dto/update-notification.dto copy';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    return await this.notificationRepository.create(dto);
  }

  async updateNotification(
    id: number,
    dto: UpdateNotificationDto,
  ): Promise<Notification | null> {
    return await this.notificationRepository.updateOne({
      where: { id },
      data: {
        has_read: dto.hasRead,
      },
    });
  }

  async listNotifications(
    userId: string,
    dto: ListNotificationsDto,
  ): Promise<PaginationResponse<Notification>> {
    const where = buildListNotificationsQuery(dto, userId);

    const count = (await this.notificationRepository.count({
      where,
    })) as number;

    const data = await this.notificationRepository.findAll({
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
