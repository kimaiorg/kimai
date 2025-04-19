import { ListExpenseDto } from '@/api/expense/dto';

export const buildListQuery = (dto: ListExpenseDto) => {
  const where: any = {
    deleted_at: null,
  };

  if (dto.project_id) {
    where.project_id = dto.project_id;
  }

  if (dto.activity_id) {
    where.activity_id = dto.activity_id;
  }

  if (dto.category_id) {
    where.category_id = dto.category_id;
  }

  if (dto.keyword) {
    where.name = {
      contains: dto.keyword,
      mode: 'insensitive',
    };
  }

  return where;
};
