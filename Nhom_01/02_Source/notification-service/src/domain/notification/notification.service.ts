import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '@/infrastructure/notification/notification.repository';
import { Notification } from '@prisma/client';
import { PaginationResponse } from '@/libs/response/pagination';
import { CreateNotificationDto } from '@/api/notification/dto';
import { buildListNotificationsQuery } from './builder';
import { ListNotificationsDto } from '@/api/notification/dto/list-notifications.dto';
import { UpdateNotificationDto } from '@/api/notification/dto/update-notification.dto copy';
import * as crypto from 'crypto';
import { Notification2Repository } from '@/infrastructure/notification/notification2.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notification2Repository: Notification2Repository,
  ) {}

  private hashUserId(userId: string): number {
    const hash = crypto.createHash('sha256').update(userId).digest('hex');
    const intValue = parseInt(hash.slice(0, 8), 16);

    return intValue % 2;
  }

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    if (this.hashUserId(dto.user_id) === 0) {
      return await this.notificationRepository.create(dto);
    }

    return await this.notification2Repository.create(dto);
  }

  async updateNotification(
    id: number,
    dto: UpdateNotificationDto,
    userId: string,
  ): Promise<Notification | null> {
    if (this.hashUserId(userId) === 0) {
      return await this.notificationRepository.updateOne({
        where: { id, user_id: userId },
        data: {
          has_read: dto.hasRead,
        },
      });
    }

    return await this.notification2Repository.updateOne({
      where: { id, user_id: userId },
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

    if (this.hashUserId(userId) === 0) {
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

    const count = (await this.notification2Repository.count({
      where,
    })) as number;

    const data = await this.notification2Repository.findAll({
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
