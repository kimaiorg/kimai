import { Module } from '@nestjs/common';
import { DomainModule } from '@/domain/domain.module';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceTemplateModule } from './invoice-template/invoice-template.module';

@Module({
  imports: [
    DomainModule,
    InfrastructureModule,
    InvoiceModule,
    InvoiceTemplateModule,
  ],
})
export class ApiModule {}
