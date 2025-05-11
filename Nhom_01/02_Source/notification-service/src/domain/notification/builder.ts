import { ListNotificationsDto } from '@/api/notification/dto';

export const buildListNotificationsQuery = (
  dto: ListNotificationsDto,
  userId: string,
) => {
  const where: Record<string, any> = {
    deleted_at: null,
  };

  if (userId) {
    where.user_id = userId;
  }

  if (dto.targetId) {
    where.target_id = dto.targetId;
  }

  if (dto.type) {
    where.type = dto.type;
  }

  if (dto.startDate) {
    where.created_at = {
      gte: new Date(dto.startDate),
    };
  }

  if (dto.endDate) {
    where.created_at = {
      lte: new Date(dto.endDate),
    };
  }

  return where;
};
