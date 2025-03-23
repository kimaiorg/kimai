import { Module } from '@nestjs/common';
import { CustomerService } from '@/domain/customer/customer.service';
import { CustomerModule as CustomerRepositoryModule } from '@/infrastructure/customer/customer.module';

@Module({
  imports: [CustomerRepositoryModule],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
