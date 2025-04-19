import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ICategoryRepository } from '@/domain/category/category.repository.interface';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'category');
  }
}
