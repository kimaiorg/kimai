import { Module } from '@nestjs/common';
import { CustomerController } from '@/api/customer/customer.controller';
import { TeamController } from '@/api/team/team.controller';
import { ProjectController } from '@/api/project/project.controller';
import { DomainModule } from '@/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [CustomerController, TeamController, ProjectController],
})
export class ApiModule {}
