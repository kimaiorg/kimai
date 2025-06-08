import { z } from 'zod';
import { createZodDto } from './create-zod.dto';

export const envDto = createZodDto(
  z.object({
    APP_HOST: z.string(),
    APP_PORT: z.string().transform(Number),
    TIMESHEET_SERVICE_URL: z.string(),
    PROJECT_SERVICE_URL: z.string(),
    NOTIFICATION_SERVICE_URL: z.string(),
  }),
);
