import { ListProjectDto } from '@/api/project/dto';

export const buildListQuery = (dto: ListProjectDto) => {
  const where: any = {
    customer_id: dto.customer_id,
  };

  if (dto.keyword) {
    where.name = {
      contains: dto.keyword,
      mode: 'insensitive',
    };
  }

  where.budget = {};
  if (dto.budget_from !== undefined) {
    where.budget.gte = dto.budget_from;
  }

  if (dto.budget_to !== undefined) {
    where.budget.lte = dto.budget_to;
  }

  return where;
};
