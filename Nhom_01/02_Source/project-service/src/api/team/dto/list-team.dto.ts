import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listTeamSchema = paginationSchema.extend({});

export type ListTeamDto = z.infer<typeof listTeamSchema>;
