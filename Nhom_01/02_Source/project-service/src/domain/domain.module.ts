import { CustomerModule } from '@/domain/customer/customer.module';
import { TeamModule } from '@/domain/team/team.module';
import { ProjectModule } from '@/domain/project/project.module';
import { ActivityModule } from '@/domain/activity/activity.module';
import { TaskModule } from '@/domain/task/task.module';
import { CategoryModule } from '@/domain/category/category.module';
import { ExpenseModule } from '@/domain/expense/expense.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CustomerModule,
    TeamModule,
    ProjectModule,
    ActivityModule,
    TaskModule,
    CategoryModule,
    ExpenseModule,
  ],
  exports: [
    CustomerModule,
    TeamModule,
    ProjectModule,
    ActivityModule,
    TaskModule,
    CategoryModule,
    ExpenseModule,
  ],
})
export class DomainModule { }
