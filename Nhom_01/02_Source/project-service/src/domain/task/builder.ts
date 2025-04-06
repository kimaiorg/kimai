import { ListTaskDto } from '@/api/task/dto';

export const buildListQuery = (dto: ListTaskDto) => {
  const where: any = {
    deleted_at: null,
  };

  if (dto.activity_id) {
    where.activity_id = dto.activity_id;
  }

  if (dto.user_id) {
    where.user_id = dto.user_id;
  }

  if (dto.keyword) {
    where.title = {
      contains: dto.keyword,
      mode: 'insensitive',
    };
  }

  return where;
};
