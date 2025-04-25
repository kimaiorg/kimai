import { Module } from '@nestjs/common';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceTemplateModule } from './invoice-template/invoice-template.module';

@Module({
  imports: [InvoiceModule, InvoiceTemplateModule],
  exports: [InvoiceModule, InvoiceTemplateModule],
})
export class DomainModule {}
