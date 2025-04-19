import { CustomerModule } from '@/infrastructure/customer/customer.module';
import { TeamModule } from '@/infrastructure/team/team.module';
import { ProjectModule } from '@/infrastructure/project/project.module';
import { ActivityModule } from '@/infrastructure/activity/activity.module';
import { TaskModule } from '@/infrastructure/task/task.module';
import { Module } from '@nestjs/common';
import { CategoryModule } from '@/infrastructure/category/category.module';

@Module({
  imports: [
    CustomerModule,
    TeamModule,
    ProjectModule,
    ActivityModule,
    TaskModule,
    CategoryModule,
  ],
  exports: [
    CustomerModule,
    TeamModule,
    ProjectModule,
    ActivityModule,
    TaskModule,
    CategoryModule,
  ],
})
export class InfrastructureModule {}
