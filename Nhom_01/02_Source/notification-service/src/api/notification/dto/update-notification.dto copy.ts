import { z } from 'zod';

export const updateNotificationSchema = z.object({
  hasRead: z.coerce.boolean(),
});

export type UpdateNotificationDto = z.infer<typeof updateNotificationSchema>;
