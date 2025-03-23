import { Module } from '@nestjs/common';
import { CustomerController } from '@/api/customer/customer.controller';
import { DomainModule } from '@/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [CustomerController],
})
export class ApiModule {}
