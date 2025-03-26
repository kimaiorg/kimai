import { CustomerModule } from '@/infrastructure/customer/customer.module';
import { TeamModule } from '@/infrastructure/team/team.module';
import { ProjectModule } from '@/infrastructure/project/project.module';
import { ActivityModule } from '@/infrastructure/activity/activity.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomerModule, TeamModule, ProjectModule, ActivityModule],
  exports: [CustomerModule, TeamModule, ProjectModule, ActivityModule],
})
export class InfrastructureModule {}
