import { BaseRepository } from '@/lib/database/repositories/base.repository';
import { PrismaClient } from '@/lib/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IExampleRepository } from '@/domain/example/example.repository.interface';
import { Example } from "@prisma/client";

@Injectable()
export class ExampleRepository extends BaseRepository<Example> implements IExampleRepository {
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'example');
  }
}
