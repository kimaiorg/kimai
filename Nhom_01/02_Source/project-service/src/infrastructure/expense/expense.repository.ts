import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IExpenseRepository } from '@/domain/expense/expense.repository.interface';
import { Expense } from '@prisma/client';

@Injectable()
export class ExpenseRepository
  extends BaseRepository<Expense>
  implements IExpenseRepository {
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'expense');
  }
}
