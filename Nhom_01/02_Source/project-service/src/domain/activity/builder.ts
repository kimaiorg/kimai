import { ListActivityDto } from '@/api/activity/dto';

export const buildListQuery = (dto: ListActivityDto) => {
  const where: any = {
    deleted_at: null,
  };

  if (dto.project_id) {
    where.project_id = dto.project_id;
  }

  if (dto.team_id) {
    where.team_id = dto.team_id;
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
