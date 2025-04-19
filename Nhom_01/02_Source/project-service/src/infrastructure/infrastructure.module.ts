import { CustomerModule } from '@/infrastructure/customer/customer.module';
import { TeamModule } from '@/infrastructure/team/team.module';
import { ProjectModule } from '@/infrastructure/project/project.module';
import { ActivityModule } from '@/infrastructure/activity/activity.module';
import { TaskModule } from '@/infrastructure/task/task.module';
import { CategoryModule } from '@/infrastructure/category/category.module';
import { ExpenseModule } from '@/infrastructure/expense/expense.module';
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
export class InfrastructureModule { }
