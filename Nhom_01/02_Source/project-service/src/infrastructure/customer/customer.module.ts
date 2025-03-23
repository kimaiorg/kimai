import { Module } from '@nestjs/common';
import { CustomerRepository } from '@/infrastructure/customer/customer.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CustomerRepository],
  exports: [CustomerRepository],
})
export class CustomerModule {}
