import { CustomerModule } from '@/domain/customer/customer.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomerModule],
  exports: [CustomerModule],
})
export class DomainModule {}
