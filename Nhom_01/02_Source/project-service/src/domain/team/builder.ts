import { ListTeamDto } from '@/api/team/dto';

export const buildListQuery = (dto: ListTeamDto) => {
  const where: any = {
    lead: dto.lead_id,
    projects: {
      some: {
        id: dto.project_id,
      },
    },
  };

  if (dto.keyword) {
    where.title = {
      contains: dto.keyword,
      mode: 'insensitive',
    };
  }

  return where;
};
