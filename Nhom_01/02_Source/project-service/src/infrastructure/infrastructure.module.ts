import { CustomerModule } from '@/infrastructure/customer/customer.module';
import { TeamModule } from '@/infrastructure/team/team.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomerModule, TeamModule],
  exports: [CustomerModule, TeamModule],
})
export class InfrastructureModule {}
