import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Team } from '@prisma/client';

export interface ITeamRepository extends BaseRepositoryInterface<Team> {}
