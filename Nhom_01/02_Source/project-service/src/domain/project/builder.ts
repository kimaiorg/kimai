import { ListProjectDto } from '@/api/project/dto';

export const buildListQuery = (dto: ListProjectDto) => {
  const where: any = {
    deleted_at: null,
  };

  if (dto.customer_id) {
    where.customer_id = dto.customer_id;
  }

  if (dto.team_id) {
    where.teams = {
      some: {
        id: dto.team_id,
      },
    };
  }

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
