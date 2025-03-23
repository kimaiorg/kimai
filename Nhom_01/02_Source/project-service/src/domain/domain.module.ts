import { CustomerModule } from '@/domain/customer/customer.module';
import { TeamModule } from '@/domain/team/team.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomerModule, TeamModule],
  exports: [CustomerModule, TeamModule],
})
export class DomainModule {}
