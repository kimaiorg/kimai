import { ListTeamDto } from '@/api/team/dto';

export const buildListQuery = (dto: ListTeamDto) => {
  const where: any = {
    deleted_at: null,
  };

  if (dto.lead_id) {
    where.lead = dto.lead_id;
  }

  if (dto.project_id) {
    where.projects = {
      some: {
        id: dto.project_id,
      },
    };
  }

  if (dto.keyword) {
    where.title = {
      contains: dto.keyword,
      mode: 'insensitive',
    };
  }

  return where;
};
