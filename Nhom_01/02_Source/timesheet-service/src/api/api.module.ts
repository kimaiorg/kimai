import { Module } from '@nestjs/common';
import { TimesheetController } from '@/api/timesheet/timesheet.controller';
import { DomainModule } from '@/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [TimesheetController],
})
export class ApiModule {}
