import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

import { NotificationType } from '@prisma/client';

export const listNotificationsSchema = paginationSchema.extend({
  type: z.nativeEnum(NotificationType).optional(),
  hasRead: z.coerce.boolean().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  targetId: z.string().optional(),
});

export type ListNotificationsDto = z.infer<typeof listNotificationsSchema>;
