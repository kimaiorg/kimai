import { z } from 'zod';

export const updateNotificationSchema = z.object({
  hasRead: z.boolean(),
});

export type UpdateNotificationDto = z.infer<typeof updateNotificationSchema>;
