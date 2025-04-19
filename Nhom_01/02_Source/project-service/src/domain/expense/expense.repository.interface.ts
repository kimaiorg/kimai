import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Expense } from '@prisma/client';

export interface IExpenseRepository
  extends BaseRepositoryInterface<Expense> { }
