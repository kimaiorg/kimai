import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { InvoiceRepository } from './repositories/invoice.repository';
import { InvoiceTemplateRepository } from './repositories/invoice-template.repository';

@Module({
  imports: [PrismaModule],
  providers: [InvoiceRepository, InvoiceTemplateRepository],
  exports: [InvoiceRepository, InvoiceTemplateRepository],
})
export class InfrastructureModule {}
