import { Module } from '@nestjs/common';
import { ExpenseService } from '@/domain/expense/expense.service';
import { ExpenseModule as ExpenseRepositoryModule } from '@/infrastructure/expense/expense.module';

@Module({
  imports: [ExpenseRepositoryModule],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule { }
