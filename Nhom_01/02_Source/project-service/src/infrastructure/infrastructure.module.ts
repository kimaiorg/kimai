import { CustomerModule } from '@/infrastructure/customer/customer.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomerModule],
  exports: [CustomerModule],
})
export class InfrastructureModule {}
