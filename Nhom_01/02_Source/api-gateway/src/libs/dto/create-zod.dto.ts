/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z, ZodSchema } from 'zod';

export function createZodDto<T extends ZodSchema>(schema: T) {
  return class {
    constructor(data: z.infer<T>) {
      Object.assign(this, schema.parse(data));
    }

    static schema = schema;
  };
}
