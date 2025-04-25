import { Module } from '@nestjs/common';
import { InvoiceTemplateService } from './invoice-template.service';
import { InvoiceTemplateRepository } from '@/infrastructure/repositories/invoice-template.repository';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InvoiceTemplateService, InvoiceTemplateRepository],
  exports: [InvoiceTemplateService],
})
export class InvoiceTemplateModule {}
