import { ListCategoryDto } from '@/api/category/dto';

export const buildListQuery = (dto: ListCategoryDto) => {
  const where: any = {
    deleted_at: null,
  };

  if (dto.keyword) {
    where.name = {
      contains: dto.keyword,
      mode: 'insensitive',
    };
  }

  return where;
};
