import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { HttpModule } from '@nestjs/axios';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
  imports: [HttpModule, InfrastructureModule],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
