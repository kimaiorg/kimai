import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '@/prisma/prisma.module';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from '@/infrastructure/repositories/invoice.repository';
import { FilteredInvoiceRepository } from '@/infrastructure/repositories/filtered-invoice.repository';
import { EmailModule } from '@/infrastructure/services/email.module';

@Module({
  imports: [HttpModule, PrismaModule, EmailModule],
  providers: [InvoiceService, InvoiceRepository, FilteredInvoiceRepository],
  exports: [InvoiceService],
})
export class InvoiceModule {}
