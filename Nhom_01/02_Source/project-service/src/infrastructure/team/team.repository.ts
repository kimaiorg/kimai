import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ITeamRepository } from '@/domain/team/team.repository.interface';
import { Team } from '@prisma/client';

@Injectable()
export class TeamRepository
  extends BaseRepository<Team>
  implements ITeamRepository
{
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'team');
  }
}
