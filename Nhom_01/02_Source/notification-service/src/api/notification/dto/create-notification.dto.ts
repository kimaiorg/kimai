import { z } from 'zod';

import { NotificationType } from '@prisma/client';

export const createNotificationSchema = z.object({
  title: z.string(),
  content: z.string(),
  type: z.nativeEnum(NotificationType),
  target_id: z.string(),
  user_id: z.string(),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
