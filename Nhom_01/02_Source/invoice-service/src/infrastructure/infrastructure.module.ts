import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { InvoiceRepository } from './repositories/invoice.repository';
import { InvoiceTemplateRepository } from './repositories/invoice-template.repository';
import { EmailModule } from './services/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  providers: [InvoiceRepository, InvoiceTemplateRepository],
  exports: [InvoiceRepository, InvoiceTemplateRepository, EmailModule],
})
export class InfrastructureModule {}
