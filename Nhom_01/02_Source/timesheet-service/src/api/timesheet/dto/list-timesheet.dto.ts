import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listTimesheetSchema = paginationSchema.extend({
  from_date: z.coerce.date().optional(),
  to_date: z.coerce.date().optional(),
  user_id: z.string().optional(),
});

export type ListTimesheetDto = z.infer<typeof listTimesheetSchema>;

export const listTimesheetsMeSchema = paginationSchema.extend({
  from_date: z.coerce.date().optional(),
  to_date: z.coerce.date().optional(),
});

export type ListTimesheetsMeDto = z.infer<typeof listTimesheetsMeSchema>;
