import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IRequestRepository } from '@/domain/request/request.repository.interface';
import { Request } from '@prisma/client';

@Injectable()
export class RequestRepository
  extends BaseRepository<Request>
  implements IRequestRepository
{
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'request');
  }
}
