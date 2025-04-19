import { Module } from '@nestjs/common';
import { ExpenseRepository } from '@/infrastructure/expense/expense.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExpenseRepository],
  exports: [ExpenseRepository],
})
export class ExpenseModule { }
