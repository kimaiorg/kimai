import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { DomainModule } from '@/domain/domain.module';
import { EmailModule } from '@/infrastructure/services/email.module';

@Module({
  imports: [DomainModule, EmailModule],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
