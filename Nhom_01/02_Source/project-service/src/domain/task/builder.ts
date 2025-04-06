import { ListTaskDto } from '@/api/task/dto';

export const buildListQuery = (dto: ListTaskDto) => {
  const where: any = {
    activity_id: dto.activity_id,
    user_id: dto.user_id,
  };

  if (dto.keyword) {
    where.title = {
      contains: dto.keyword,
      mode: 'insensitive',
    };
  }

  return where;
};
