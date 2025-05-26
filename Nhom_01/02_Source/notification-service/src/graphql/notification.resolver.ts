import { Resolver, Query, Args } from '@nestjs/graphql';
import {
  Notification,
  NotificationListResult,
  NotificationType,
} from './notification.entity';
import { ListNotificationsInput } from './list-notifications.input';
import { NotificationService } from '@/domain/notification/notification.service';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => NotificationListResult)
  async listNotifications(
    @Args('input') input: ListNotificationsInput,
  ): Promise<NotificationListResult> {
    const notifications = await this.notificationService.listNotifications(
      input.userId,
      {
        type: input?.type,
        hasRead: input?.hasRead,
        startDate: input?.startDate,
        endDate: input?.endDate,
        targetId: input?.targetId,
        page: input?.page ?? 1,
        limit: input?.limit ?? 10,
        sortBy: input?.sortBy ?? 'created_at',
        sortOrder: input?.sortOrder ?? 'desc',
      },
    );

    const convertedNotifications = notifications.data.map((notification) => {
      return {
        id: notification.id,
        title: notification.title,
        content: notification.content,
        type: notification.type as NotificationType,
        target_id: notification.target_id,
        user_id: notification.user_id,
        has_read: notification.has_read,
        created_at: notification.created_at,
        updated_at: notification.updated_at,
        deleted_at: notification.deleted_at || undefined,
      };
    });

    return {
      data: convertedNotifications,
      metadata: {
        total: notifications.metadata.total,
        page: notifications.metadata.page,
        limit: notifications.metadata.limit,
        totalPages: notifications.metadata.totalPages,
      },
    };
  }
}
