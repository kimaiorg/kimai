import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Expense } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { ExpenseService } from '@/domain/expense/expense.service';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  CreateExpenseSwagger,
  UpdateExpenseSwagger,
  ListExpenseSwaggerDto,
} from '@/api/expense/swagger';
import {
  ListExpenseDto,
  listExpenseSchema,
  updateExpenseSchema,
  UpdateExpenseDto,
  createExpenseSchema,
  CreateExpenseDto,
} from '@/api/expense/dto';
import { PaginationResponse } from '@/libs/response/pagination';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) { }
  @Post('')
  @ApiBody({ type: CreateExpenseSwagger })
  @Permissions(['create:expenses'])
  @UsePipes(new ZodValidationPipe(createExpenseSchema))
  async createExpense(@Body() dto: CreateExpenseDto): Promise<Expense | null> {
    return await this.expenseService.createExpense(dto);
  }

  @Get(':id')
  async getExpense(@Param('id', ParseIntPipe) id: number): Promise<Expense | null> {
    return await this.expenseService.getExpense(id);
  }

  @Get('')
  @ApiQuery({ type: ListExpenseSwaggerDto, required: false })
  @Permissions(['read:expenses'])
  @UsePipes(new ZodValidationPipe(listExpenseSchema))
  async listExpenses(
    @Query() dto: ListExpenseDto,
  ): Promise<PaginationResponse<Expense>> {
    return await this.expenseService.listExpenses(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateExpenseSwagger, required: false })
  @Permissions(['update:expenses'])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateExpenseSchema)) dto: UpdateExpenseDto,
  ): Promise<Expense | null> {
    return await this.expenseService.updateExpense(id, dto);
  }
}
