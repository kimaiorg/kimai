import { Module } from '@nestjs/common';
import { CustomerController } from '@/api/customer/customer.controller';
import { TeamController } from '@/api/team/team.controller';
import { ProjectController } from '@/api/project/project.controller';
import { ActivityController } from '@/api/activity/activity.controller';
import { TaskController } from '@/api/task/task.controller';
import { CategoryController } from '@/api/category/category.controller';
import { ExpenseController } from '@/api/expense/expense.controller';
import { RequestController } from '@/api/request/request.controller';
import { DomainModule } from '@/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [
    CustomerController,
    TeamController,
    ProjectController,
    ActivityController,
    TaskController,
    CategoryController,
    ExpenseController,
    RequestController,
  ],
})
export class ApiModule {}
