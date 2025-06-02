import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { DomainModule } from '../../domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [ReportController],
})
export class ReportModule {}
