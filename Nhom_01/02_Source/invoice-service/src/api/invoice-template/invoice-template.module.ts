import { Module } from '@nestjs/common';
import { InvoiceTemplateController } from './invoice-template.controller';
import { DomainModule } from '@/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [InvoiceTemplateController],
})
export class InvoiceTemplateModule {}
