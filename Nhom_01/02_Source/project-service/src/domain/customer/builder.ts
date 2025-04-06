import { ListCustomerDto } from '@/api/customer/dto';

export const buildListQuery = (dto: ListCustomerDto) => {
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
