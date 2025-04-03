import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listTimesheetSchema = paginationSchema.extend({
  from_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  user_id: z.string().optional(),
});

export type ListTimesheetDto = z.infer<typeof listTimesheetSchema>;
