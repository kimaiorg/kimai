import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

import { TimesheetStatus } from '@prisma/client';

export const listTimesheetsSchema = paginationSchema.extend({
  from_date: z.coerce.date().optional(),
  to_date: z.coerce.date().optional(),
  user_id: z.string().optional(),
  project_id: z.coerce.number().optional(),
  activity_id: z.coerce.number().optional(),
  task_id: z.coerce.number().optional(),
  status: z.nativeEnum(TimesheetStatus).optional(),
});

export type ListTimesheetsDto = z.infer<typeof listTimesheetsSchema>;

export const listTimesheetsMeSchema = paginationSchema.extend({
  from_date: z.coerce.date().optional(),
  to_date: z.coerce.date().optional(),
});

export type ListTimesheetsMeDto = z.infer<typeof listTimesheetsMeSchema>;
