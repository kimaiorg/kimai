/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

export class ZodValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const SchemaClass = metadata.metatype as any;
    if (SchemaClass?.schema) {
      try {
        return SchemaClass.schema.parse(value);
      } catch (error) {
        throw new BadRequestException(error.errors);
      }
    }
    return value;
  }
}
