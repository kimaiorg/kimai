import { CustomerModule } from '@/infrastructure/customer/customer.module';
import { TeamModule } from '@/infrastructure/team/team.module';
import { ProjectModule } from '@/infrastructure/project/project.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomerModule, TeamModule, ProjectModule],
  exports: [CustomerModule, TeamModule, ProjectModule],
})
export class InfrastructureModule {}
