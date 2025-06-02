import { Module } from '@nestjs/common';
// import { PrismaModule } from '../prisma/prisma.module'; // Temporarily disabled
import { ReportRepository } from './repositories/report.repository';

@Module({
  imports: [], // PrismaModule temporarily disabled
  providers: [ReportRepository],
  exports: [ReportRepository],
})
export class InfrastructureModule {}
