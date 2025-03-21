import { z } from 'zod';
import { createZodDto } from '@/lib/dto';

export const envDto = createZodDto(
  z.object({
    APP_HOST: z.string(),
    APP_PORT: z.string().transform(Number),
    APP_VERSION: z.string().transform(Number),
    DATABASE_URL: z.string(),
  }),
);
