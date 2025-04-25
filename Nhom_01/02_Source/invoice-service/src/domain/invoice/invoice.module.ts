import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from '@/infrastructure/repositories/invoice.repository';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [InvoiceService, InvoiceRepository],
  exports: [InvoiceService],
})
export class InvoiceModule {}
