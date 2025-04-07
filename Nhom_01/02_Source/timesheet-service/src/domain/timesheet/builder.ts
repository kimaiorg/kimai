import { ListTimesheetsMeDto } from '@/api/timesheet/dto';

export const buildListTimesheetsMeQuery = (
  userId: string,
  dto: ListTimesheetsMeDto,
) => {
  const where: any = {
    user_id: userId,
    deleted_at: null,
  };

  if (dto.from_date) {
    where.start_time = {
      gte: new Date(dto.from_date),
    };
  }

  if (dto.to_date) {
    where.end_time = {
      lte: new Date(dto.to_date),
    };
  }

  return where;
};
