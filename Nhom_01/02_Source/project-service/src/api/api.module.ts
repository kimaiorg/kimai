import { Module } from '@nestjs/common';
import { CustomerController } from '@/api/customer/customer.controller';
import { TeamController } from '@/api/team/team.controller';
import { DomainModule } from '@/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [CustomerController, TeamController],
})
export class ApiModule {}
