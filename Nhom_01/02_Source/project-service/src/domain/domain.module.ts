import { CustomerModule } from '@/domain/customer/customer.module';
import { TeamModule } from '@/domain/team/team.module';
import { ProjectModule } from '@/domain/project/project.module';
import { ActivityModule } from '@/domain/activity/activity.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomerModule, TeamModule, ProjectModule, ActivityModule],
  exports: [CustomerModule, TeamModule, ProjectModule, ActivityModule],
})
export class DomainModule {}
