import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { DomainModule } from '@/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
