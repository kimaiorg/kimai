import { ListTimesheetsDto, ListTimesheetsMeDto } from '@/api/timesheet/dto';

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

export const buildListTimesheetsQuery = (dto: ListTimesheetsDto) => {
  const where: any = {
    deleted_at: null,
  };

  if (dto.user_id) {
    where.user_id = dto.user_id;
  }

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

  if (dto.project_id) {
    where.project_id = dto.project_id;
  }

  if (dto.activity_id) {
    where.activity_id = dto.activity_id;
  }

  if (dto.task_id) {
    where.task_id = dto.task_id;
  }

  if (dto.status) {
    where.status = dto.status;
  }

  return where;
};
