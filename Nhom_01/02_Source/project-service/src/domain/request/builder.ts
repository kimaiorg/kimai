import { ListRequestDto } from '@/api/request/dto';
import { Prisma } from '@prisma/client';
export const buildListQuery = (dto: ListRequestDto) => {
  const where: Prisma.RequestWhereInput = {
    deleted_at: null,
  };

  if (dto.team_id) {
    where.team_id = dto.team_id;
  }

  if (dto.type) {
    where.type = dto.type;
  }

  if (dto.status) {
    where.status = dto.status;
  }

  if (dto.keyword) {
    where.comment = { contains: dto.keyword, mode: 'insensitive' };
  }

  if (dto.user_id) {
    where.user_id = dto.user_id;
  }

  return where;
};
