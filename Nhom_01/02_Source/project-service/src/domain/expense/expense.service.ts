import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from '@/infrastructure/expense/expense.repository';
import { Category, Expense } from '@prisma/client';
import { PaginationResponse } from '@/libs/response/pagination';
import { buildListQuery } from './builder';
import { CreateExpenseDto, ListExpenseDto, UpdateExpenseDto } from '@/api/expense/dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseRepository: ExpenseRepository) { }

  async createExpense(dto: CreateExpenseDto): Promise<Expense | null> {
    return await this.expenseRepository.create(dto);
  }

  async getExpense(id: number): Promise<Expense | null> {
    return await this.expenseRepository.findById(id, {
      include: {
        category: true,
        activity: true,
        task: true,
      },
    });
  }

  async listExpenses(
    dto: ListExpenseDto,
  ): Promise<PaginationResponse<Expense>> {
    const where = buildListQuery(dto);
    const count = (await this.expenseRepository.count({
      where,
    })) as number;

    const data = await this.expenseRepository.findAll({
      where,
      include: {
        category: true,
        activity: true,
        task: true,
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      orderBy: {
        [dto.sort_by]: dto.sort_order,
      },
    });

    return {
      data,
      metadata: {
        total: count || 0,
        totalPages: Math.ceil(count / dto.limit) || 0,
        page: dto.page,
        limit: dto.limit,
      },
    };
  }

  async updateExpense(
    id: number,
    dto: UpdateExpenseDto,
  ): Promise<Expense | null> {
    return await this.expenseRepository.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: dto,
    });
  }
}
